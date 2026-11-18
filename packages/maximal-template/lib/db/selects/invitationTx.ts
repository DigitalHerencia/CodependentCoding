/** Invitation Tx contracts and composition for the owning application slice. */
import "server-only";

import { createHash, randomBytes } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";
import type {
  InvitationAdministrationScope,
  InvitationCreateValues,
  InvitationEditValues,
  InvitationAcceptanceRecord,
  InvitationAcceptanceResult,
} from "@/types/invitationTypes";
import { assertMembershipAdministratorTx } from "@/lib/db/selects/authzTx";
import {
  invitationSelect,
  invitationMembershipSelect,
  invitationMembershipIdentifierSelect,
} from "@/lib/db/selects/invitationSelects";
import { INVITATION_TTL_DAYS } from "@/lib/constants/invitations";

import { setRlsContext } from "@/lib/db/rls";
import { assertInvitationsAllowed } from "@/lib/authz/tenancy";
import { tenancy } from "@/lib/authz/mode";
import { invitableRoles } from "@/lib/authz/roles";

import { ResourceNotFoundError } from "@/lib/db/transactions/errors";

/** Only the hash of an invitation token is stored or looked up. */
export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Accepts a pending invitation for `userId`: marks it ACCEPTED and creates the
 * membership. Inactive memberships require administrator action. An active membership keeps its
 * role, except a single-tenant default VIEWER created after the invitation may receive
 * its invited role on the first successful acceptance. Idempotent: accepting again returns the same membership.
 */
export async function acceptInvitationTx(
  tx: Prisma.TransactionClient,
  invitation: InvitationAcceptanceRecord,
  userId: string,
): Promise<InvitationAcceptanceResult> {
  assertInvitationsAllowed(invitation.organizationId);
  if (!invitableRoles.some((role) => role === invitation.role))
    throw new ResourceNotFoundError("Invitation");
  const { organizationId } = invitation;
  // Serialize with signup provisioning and other invitation acceptances.
  const lockKey = `workspace-provision:${userId}`;
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`;
  await setRlsContext(tx, { organizationId });
  const accepted = await tx.invitation.updateMany({
    where: {
      id: invitation.id,
      organizationId,
      role: invitation.role,
      ...(invitation.email ? { email: invitation.email } : {}),
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    data: { status: "ACCEPTED", acceptedAt: new Date() },
  });
  const existing = await tx.membership.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
    select: invitationMembershipSelect,
  });
  if (accepted.count === 0) {
    if (existing?.status === "ACTIVE")
      return { membershipId: existing.id, organizationId };
    throw new ResourceNotFoundError("Invitation");
  }
  if (existing && existing.status !== "ACTIVE")
    throw new ResourceNotFoundError("Invitation");

  let upgradedViewer = false;
  if (
    tenancy === "single" &&
    existing?.status === "ACTIVE" &&
    existing.role === "VIEWER" &&
    invitation.role !== "VIEWER" &&
    invitation.createdAt &&
    existing.createdAt >= invitation.createdAt
  ) {
    const promoted = await tx.membership.updateMany({
      where: {
        id: existing.id,
        organizationId,
        status: "ACTIVE",
        role: "VIEWER",
        createdAt: { gte: invitation.createdAt },
      },
      data: { role: invitation.role },
    });
    upgradedViewer = promoted.count === 1;
  }
  const membership =
    existing ??
    (await tx.membership.create({
      data: { organizationId, userId, role: invitation.role },
      select: invitationMembershipIdentifierSelect,
    }));

  await tx.auditEvent.create({
    data: {
      organizationId,
      actorUserId: userId,
      action: "membership.invitation.accepted",
      resourceType: "Invitation",
      resourceId: invitation.id,
      metadata: {
        role: invitation.role,
        ...(upgradedViewer
          ? { previousRole: "VIEWER", nextRole: invitation.role }
          : {}),
      },
    },
  });
  return { membershipId: membership.id, organizationId };
}

/** Create a shareable invitation and append its audit event in the same transaction. */
export async function createInvitationTx(
  tx: Prisma.TransactionClient,
  scope: InvitationAdministrationScope,
  input: InvitationCreateValues,
) {
  assertInvitationsAllowed(scope.organizationId);
  await assertMembershipAdministratorTx(tx, {
    ...scope,
    permission: "base.membership:create",
  });
  const token = randomBytes(32).toString("base64url");
  const record = await tx.invitation.create({
    data: {
      organizationId: scope.organizationId,
      email: input.email,
      role: input.role,
      tokenHash: hashInvitationToken(token),
      invitedByUserId: scope.actorUserId,
      expiresAt: new Date(Date.now() + INVITATION_TTL_DAYS * 86_400_000),
    },
    select: invitationSelect,
  });
  await tx.auditEvent.create({
    data: {
      organizationId: scope.organizationId,
      actorUserId: scope.actorUserId,
      action: "membership.invitation.created",
      resourceType: "Invitation",
      resourceId: record.id,
      metadata: { role: input.role },
    },
  });
  return { record, path: `/invitations/${token}` };
}

/** Replace a live invitation's recipient and role without rotating its private token. */
export async function editInvitationTx(
  tx: Prisma.TransactionClient,
  scope: InvitationAdministrationScope,
  input: InvitationEditValues,
) {
  assertInvitationsAllowed(scope.organizationId);
  await assertMembershipAdministratorTx(tx, {
    ...scope,
    permission: "base.membership:update",
  });
  const result = await tx.invitation.updateMany({
    where: {
      id: input.invitationId,
      organizationId: scope.organizationId,
      status: "PENDING",
      requiresToken: true,
      expiresAt: { gt: new Date() },
    },
    data: { email: input.email, role: input.role },
  });
  if (result.count !== 1) throw new ResourceNotFoundError("Invitation");
  const record = await tx.invitation.findUniqueOrThrow({
    where: { id: input.invitationId, organizationId: scope.organizationId },
    select: invitationSelect,
  });
  await tx.auditEvent.create({
    data: {
      organizationId: scope.organizationId,
      actorUserId: scope.actorUserId,
      action: "membership.invitation.updated",
      resourceType: "Invitation",
      resourceId: record.id,
      metadata: { role: input.role },
    },
  });
  return record;
}

/** Cancel one pending tenant invitation with a fresh administrator check and atomic audit. */
export async function revokeInvitationTx(
  tx: Prisma.TransactionClient,
  scope: InvitationAdministrationScope,
  invitationId: string,
) {
  assertInvitationsAllowed(scope.organizationId);
  await assertMembershipAdministratorTx(tx, {
    ...scope,
    permission: "base.membership:delete",
  });
  const result = await tx.invitation.updateMany({
    where: {
      id: invitationId,
      organizationId: scope.organizationId,
      status: "PENDING",
    },
    data: { status: "REVOKED" },
  });
  if (result.count !== 1) throw new ResourceNotFoundError("Invitation");
  await tx.auditEvent.create({
    data: {
      organizationId: scope.organizationId,
      actorUserId: scope.actorUserId,
      action: "membership.invitation.revoked",
      resourceType: "Invitation",
      resourceId: invitationId,
    },
  });
  return { id: invitationId };
}
