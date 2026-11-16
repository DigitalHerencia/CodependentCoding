import "server-only";

import { randomBytes } from "node:crypto";

import type {
  MembershipRole,
  MembershipStatus,
  Prisma,
} from "@/generated/prisma/client";

import { INVITATION_TTL_DAYS } from "@/lib/constants/invitations";
import { SINGLE_ORGANIZATION_ID, tenancy } from "@/lib/authz/mode";
import { invitableRoles, isPrivilegedRole } from "@/lib/authz/roles";
import { assertInvitationsAllowed } from "@/lib/authz/tenancy";
import { hashInvitationToken } from "./invitationTx";
import { adminMembershipSelect } from "@/lib/db/selects/adminSelects";
import { InvariantViolationError, ResourceNotFoundError } from "./errors";

/** Re-read and lock the actor in the server-selected organization before mutation. */
export async function assertMembershipAdministratorTx(
  tx: Prisma.TransactionClient,
  input: { organizationId: string; actorUserId: string },
): Promise<void> {
  if (tenancy === "single" && input.organizationId !== SINGLE_ORGANIZATION_ID)
    throw new ResourceNotFoundError("Organization");
  const lockKey = `membership-administration:${input.organizationId}`;
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`;
  const [actor] = await tx.$queryRaw<{ role: MembershipRole; status: MembershipStatus }[]>`
    SELECT "role", "status" FROM "Membership"
    WHERE "organizationId" = ${input.organizationId}::uuid AND "userId" = ${input.actorUserId}
    FOR UPDATE
  `;
  if (!actor || actor.status !== "ACTIVE" || !isPrivilegedRole(actor.role))
    throw new ResourceNotFoundError("Administrator membership");
}

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
  await assertMembershipAdministratorTx(tx, input);
  const membership = await tx.membership.findFirst({
    where: {
      id: input.membershipId,
      organizationId: input.organizationId,
    },
    select: { id: true, userId: true, role: true, status: true },
  });
  if (!membership) throw new ResourceNotFoundError("Membership");
  // Routine administration never grants, removes or transfers ownership.
  if (membership.role === "OWNER" || input.role === "OWNER")
    throw new InvariantViolationError("Ownership cannot be changed through routine membership administration.");
  if (membership.userId === input.actorUserId)
    throw new InvariantViolationError("An administrator cannot change their own membership.");

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
      metadata: {
        source: "server-action",
        affectedUserId: membership.userId,
        previous: { role: membership.role, status: membership.status },
        next: { role: updated.role, status: updated.status },
      },
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
  assertInvitationsAllowed();
  await assertMembershipAdministratorTx(tx, input);
  if (!invitableRoles.some((role) => role === input.role))
    throw new InvariantViolationError("An invitation cannot grant ownership.");
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
      metadata: { role: input.role, source: "server-action" },
    },
  });
}
