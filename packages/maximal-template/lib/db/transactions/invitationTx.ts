import "server-only";

import { createHash } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";
import type { AppRole } from "@/types/accessTypes";

import { setRlsContext } from "@/lib/db/rls";
import { assertInvitationsAllowed } from "@/lib/authz/tenancy";
import { invitableRoles } from "@/lib/authz/roles";

import { ResourceNotFoundError } from "./errors";

/** Only the hash of an invitation token is stored or looked up. */
export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Accepts a pending invitation for `userId`: marks it ACCEPTED and creates the
 * membership. Inactive memberships require administrator action. An active membership keeps its
 * role. Idempotent: accepting again returns the same membership.
 */
export async function acceptInvitationTx(
  tx: Prisma.TransactionClient,
  invitation: { id: string; organizationId: string; role: AppRole },
  userId: string,
): Promise<{ membershipId: string; organizationId: string }> {
  assertInvitationsAllowed();
  if (!invitableRoles.some((role) => role === invitation.role))
    throw new ResourceNotFoundError("Invitation");
  const { organizationId } = invitation;
  // Serialize with signup provisioning and other invitation acceptances.
  const lockKey = `workspace-provision:${userId}`;
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`;
  await setRlsContext(tx, { organizationId });
  const accepted = await tx.invitation.updateMany({
    where: { id: invitation.id, organizationId, role: invitation.role, status: "PENDING", expiresAt: { gt: new Date() } },
    data: { status: "ACCEPTED", acceptedAt: new Date() },
  });
  const existing = await tx.membership.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
    select: { id: true, status: true },
  });
  if (accepted.count === 0) {
    if (existing?.status === "ACTIVE")
      return { membershipId: existing.id, organizationId };
    throw new ResourceNotFoundError("Invitation");
  }
  if (existing && existing.status !== "ACTIVE")
    throw new ResourceNotFoundError("Invitation");

  const membership =
    existing ??
    (await tx.membership.create({
      data: { organizationId, userId, role: invitation.role },
      select: { id: true },
    }));

  await tx.auditEvent.create({
    data: {
      organizationId,
      actorUserId: userId,
      action: "membership.invitation.accepted",
      resourceType: "Invitation",
      resourceId: invitation.id,
      metadata: { role: invitation.role },
    },
  });
  return { membershipId: membership.id, organizationId };
}
