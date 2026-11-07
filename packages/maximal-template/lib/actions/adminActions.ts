"use server";

import {
  addAdminMembershipSchema,
  adminBulkOperationSchema,
  changeAdminMembershipSchema,
  updateAdminMembershipStatusSchema,
} from "@/schemas/adminSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toAdminMembershipDTO } from "@/lib/db/dtos/adminDtos";
import { withTenantTransaction } from "@/lib/db/tenant";
import {
  approveWorkspaceAccessTx,
  updateMembershipAdministrationTx,
} from "@/lib/db/transactions/adminTx";
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
  return toActionResult(async () => {
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
  });
}

export async function suspendAdminMembership(rawInput: unknown) {
  return toActionResult(async () => {
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
  });
}

export async function restoreAdminMembership(rawInput: unknown) {
  return toActionResult(async () => {
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
  });
}

export async function addAdminMembership(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "admin.membership:create");
      const input = addAdminMembershipSchema.parse(rawInput);
      await approveWorkspaceAccessTx(tx, {
        ...input,
        organizationId: access.organizationId,
        actorUserId: access.userId,
      });
    });
  });
}
