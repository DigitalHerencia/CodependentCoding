"use server";
/** Authenticated admin mutation boundary: validate, authorize, transact and return safe results. */
import {
  changeAdminMembershipSchema,
  updateAdminMembershipStatusSchema,
} from "@/schemas/adminSchemas";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { toAdminMembershipDTO } from "@/lib/db/dtos/adminDtos";
import { withTenantTransaction } from "@/lib/db/tenancy";
import { updateMembershipAdministrationTx } from "@/lib/db/selects/adminTx";
import { toActionResult } from "@/lib/utils/actionResult";
import type { AdminMutationKind } from "@/types/adminTypes";
import { invalidatePaths } from "@/lib/cache/invalidate";
/** Shared single-command boundary avoids drift between suspend, restore and role updates. */
async function mutateMembership(rawInput: unknown, kind: AdminMutationKind) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const result = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "admin.membership:update");
      const input =
        kind === "role"
          ? changeAdminMembershipSchema.parse(rawInput)
          : {
              ...updateAdminMembershipStatusSchema.parse(rawInput),
              role: undefined,
            };
      const membership = await updateMembershipAdministrationTx(tx, {
        organizationId: access.organizationId,
        actorUserId: access.userId,
        permission: "admin.membership:update",
        membershipId: input.membershipId,
        ...(input.role !== undefined
          ? {
              role: input.role,
              deniedPermissions: input.deniedPermissions,
              targetOrganizationId: input.organizationId,
            }
          : { status: kind === "suspend" ? "SUSPENDED" : "ACTIVE" }),
      });
      return toAdminMembershipDTO(membership, access.userId);
    });
    invalidatePaths([
      "/admin",
      "/admin/users",
      `/admin/users/${result.user.id}`,
      `/admin/users/${result.user.id}/edit`,
      "/settings/members",
    ]);
    return result;
  });
}
/** Change another non-owner member's role. */
export async function changeAdminMembership(rawInput: unknown) {
  return mutateMembership(rawInput, "role");
}
/** Suspend another non-owner member. */
export async function suspendAdminMembership(rawInput: unknown) {
  return mutateMembership(rawInput, "suspend");
}
/** Restore another non-owner member. */
export async function restoreAdminMembership(rawInput: unknown) {
  return mutateMembership(rawInput, "restore");
}
