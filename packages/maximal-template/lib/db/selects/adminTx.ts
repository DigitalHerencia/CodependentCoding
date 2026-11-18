/** Atomic administration helpers run only inside authenticated tenant transactions. */
import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { AdminMembershipUpdate } from "@/types/adminTypes";

import { permissions } from "@/lib/authz/permissions";
import {
  transferOrganizationMembershipTx,
  assertMembershipAdministratorTx,
} from "@/lib/db/selects/authzTx";
import {
  adminMembershipSelect,
  adminMembershipTargetSelect,
} from "@/lib/db/selects/adminSelects";
import {
  InvariantViolationError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";

/** Serialize administration per organization, recheck access, update and append audit atomically. */
export async function updateMembershipAdministrationTx(
  tx: Prisma.TransactionClient,
  input: AdminMembershipUpdate,
) {
  // Acquire multiple organization locks in a stable order before either membership changes.
  for (const organizationId of [
    ...new Set([
      input.organizationId,
      input.targetOrganizationId ?? input.organizationId,
    ]),
  ].sort()) {
    const key = `membership-administration:${organizationId}`;
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${key}, 0))`;
  }
  await assertMembershipAdministratorTx(tx, input);
  await tx.$queryRaw`SELECT "id" FROM "Membership" WHERE "id" = ${input.membershipId}::uuid AND "organizationId" = ${input.organizationId}::uuid FOR UPDATE`;
  const membership = await tx.membership.findFirst({
    where: {
      id: input.membershipId,
      organizationId: input.organizationId,
    },
    select: adminMembershipTargetSelect,
  });
  if (!membership) throw new ResourceNotFoundError("Membership");
  // Routine administration never grants, removes or transfers ownership.
  if (membership.role === "OWNER" || input.role === "OWNER")
    throw new InvariantViolationError(
      "Ownership cannot be changed through routine membership administration.",
    );
  if (membership.userId === input.actorUserId)
    throw new InvariantViolationError(
      "An administrator cannot change their own membership.",
    );

  if (
    input.deniedPermissions?.some(
      (permission) => !permissions.some((known) => known === permission),
    )
  )
    throw new InvariantViolationError("Unknown permission restriction.");

  const targetOrganizationId =
    input.targetOrganizationId ?? input.organizationId;
  const moving = targetOrganizationId !== input.organizationId;
  if (moving) {
    await transferOrganizationMembershipTx(tx, {
      sourceOrganizationId: input.organizationId,
      organizationId: targetOrganizationId,
      actorUserId: input.actorUserId,
      userId: membership.userId,
      role: input.role ?? membership.role,
      status: membership.status,
      deniedPermissions:
        input.deniedPermissions ?? membership.deniedPermissions,
    });
  }

  const updated = await tx.membership.update({
    where: { id: membership.id, organizationId: input.organizationId },
    data: {
      ...(input.role ? { role: input.role } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.deniedPermissions
        ? { deniedPermissions: [...new Set(input.deniedPermissions)] }
        : {}),
      ...(moving ? { status: "SUSPENDED" } : {}),
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
        previous: {
          role: membership.role,
          status: membership.status,
          deniedPermissions: membership.deniedPermissions,
        },
        next: {
          role: updated.role,
          status: updated.status,
          deniedPermissions: updated.deniedPermissions,
        },
        ...(moving ? { targetOrganizationId: input.targetOrganizationId } : {}),
      },
    },
  });
  return updated;
}
