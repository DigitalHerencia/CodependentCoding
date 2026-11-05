import "server-only";

import { randomBytes } from "node:crypto";

import type {
  MembershipRole,
  MembershipStatus,
  Prisma,
} from "@/generated/prisma/client";

import { INVITATION_TTL_DAYS } from "@/lib/constants/invitations";
import { hashInvitationToken } from "./invitationTx";
import { adminMembershipSelect } from "@/lib/db/selects/adminSelects";
import { ResourceNotFoundError } from "./errors";

export async function updateMembershipAdministrationTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    actorUserId: string;
    membershipId: string;
    role?: MembershipRole;
    status?: MembershipStatus;
  },
) {
  const membership = await tx.membership.findFirst({
    where: {
      id: input.membershipId,
      organizationId: input.organizationId,
    },
    select: { id: true },
  });
  if (!membership) throw new ResourceNotFoundError("Membership");

  const updated = await tx.membership.update({
    where: { id: membership.id },
    data: {
      ...(input.role ? { role: input.role } : {}),
      ...(input.status ? { status: input.status } : {}),
    },
    select: adminMembershipSelect,
  });
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "admin.membership.updated",
      resourceType: "Membership",
      resourceId: updated.id,
      metadata: { role: updated.role, status: updated.status },
    },
  });
  return updated;
}

export async function approveWorkspaceAccessTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    actorUserId: string;
    email: string;
    role: Exclude<MembershipRole, "OWNER">;
  },
) {
  const approvalKey = `workspace-approval:${input.organizationId}:${input.email}`;
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${approvalKey}, 0))`;
  await tx.invitation.updateMany({
    where: {
      organizationId: input.organizationId,
      email: input.email,
      requiresToken: false,
      status: "PENDING",
    },
    data: { status: "REVOKED" },
  });
  const approval = await tx.invitation.create({
    data: {
      organizationId: input.organizationId,
      email: input.email,
      role: input.role,
      invitedByUserId: input.actorUserId,
      requiresToken: false,
      tokenHash: hashInvitationToken(randomBytes(32).toString("base64url")),
      expiresAt: new Date(Date.now() + INVITATION_TTL_DAYS * 86_400_000),
    },
    select: { id: true },
  });
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "admin.membership.approved",
      resourceType: "Invitation",
      resourceId: approval.id,
      metadata: { role: input.role },
    },
  });
}
