"use server";

import {
  addAdminMembershipSchema,
  adminBulkOperationSchema,
  changeAdminMembershipSchema,
  updateAdminMembershipStatusSchema,
} from "@/schemas/adminSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toAdminMembershipDTO } from "@/lib/db/dto/admin.dto";
import { withTenantTransaction } from "@/lib/db/tenant";
import { updateMembershipAdministrationTx } from "@/lib/db/transactions/admin.tx";
import { adminMembershipSelect } from "@/lib/db/selects/admin.selects";
import { InvariantViolationError } from "@/lib/db/transactions/errors";
import { toActionResult } from "@/lib/utils/actionResult";

/** Every command commits together or none does; an administrator never changes their own membership. */
export async function executeAdminBulkOperation(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "admin.membership:update");
      const commands = adminBulkOperationSchema.parse(rawInput);
      const results = [];
      for (const command of commands) {
        if (
          command.kind !== "restore" &&
          command.membershipId === access.membershipId
        ) {
          throw new InvariantViolationError(
            "An administrator cannot change their own membership.",
          );
        }
        const membership = await updateMembershipAdministrationTx(tx, {
          organizationId: access.organizationId,
          actorUserId: access.userId,
          membershipId: command.membershipId,
          ...(command.kind === "change-role"
            ? { role: command.role }
            : { status: command.kind === "suspend" ? "SUSPENDED" : "ACTIVE" }),
        });
        results.push(toAdminMembershipDTO(membership));
      }
      return results;
    });
  });
}

export async function changeAdminMembership(rawInput: unknown) {
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin.membership:update");
    const input = changeAdminMembershipSchema.parse(rawInput);
    if (input.membershipId === access.membershipId) {
      throw new InvariantViolationError(
        "An administrator cannot change their own role.",
      );
    }

    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: input.membershipId,
      role: input.role,
    });
    return toAdminMembershipDTO(membership);
  });
}

export async function suspendAdminMembership(rawInput: unknown) {
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin.membership:update");
    const input = updateAdminMembershipStatusSchema.parse(rawInput);
    if (input.membershipId === access.membershipId) {
      throw new InvariantViolationError(
        "An administrator cannot suspend their own membership.",
      );
    }

    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: input.membershipId,
      status: "SUSPENDED",
    });
    return toAdminMembershipDTO(membership);
  });
}

export async function restoreAdminMembership(rawInput: unknown) {
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin.membership:update");
    const input = updateAdminMembershipStatusSchema.parse(rawInput);
    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: input.membershipId,
      status: "ACTIVE",
    });
    return toAdminMembershipDTO(membership);
  });
}

export async function addAdminMembership(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin.membership:create");
    const input = addAdminMembershipSchema.parse(rawInput);
    const user = await tx.user.findFirst({
      where: { email: { equals: input.email, mode: "insensitive" } },
      select: { id: true },
    });
    if (!user) throw new Error("The user must register before being added.");
    const membership = await tx.membership.create({
      data: {
        organizationId: access.organizationId,
        userId: user.id,
        role: input.role,
        status: "ACTIVE",
      },
      select: adminMembershipSelect,
    });
    await tx.auditEvent.create({
      data: {
        organizationId: access.organizationId,
        actorUserId: access.userId,
        action: "admin.membership.created",
        resourceType: "Membership",
        resourceId: membership.id,
        metadata: { role: input.role },
      },
    });
    return toAdminMembershipDTO(membership);
  });
}
