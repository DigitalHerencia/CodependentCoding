"use server";
/** Authenticated admin mutation boundary: validate, authorize, transact and return safe results. */
import {
  addAdminMembershipSchema,
  changeAdminMembershipSchema,
  updateAdminMembershipStatusSchema,
} from "@/schemas/adminSchemas";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { assertInvitationsAllowed } from "@/lib/authz/tenancy";
import { toAdminMembershipDTO } from "@/lib/db/dtos/adminDto";
import { withTenantTransaction } from "@/lib/db/tenancy";
import {
  approveWorkspaceAccessTx,
  updateMembershipAdministrationTx,
} from "@/lib/db/selects/adminTx";
import { toActionResult } from "@/lib/utils/actionResult";
import type { AdminMutationKind } from "@/types/adminTypes";
/** Shared single-command boundary avoids drift between suspend, restore and role updates. */
async function mutateMembership(rawInput: unknown, kind: AdminMutationKind) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
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
        membershipId: input.membershipId,
        ...(input.role !== undefined
          ? { role: input.role }
          : { status: kind === "suspend" ? "SUSPENDED" : "ACTIVE" }),
      });
      return toAdminMembershipDTO(membership, access.userId);
    });
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
/** Preserve the existing verified-email access approval; no new invitation behavior is introduced. */
export async function addAdminMembership(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "admin.membership:create");
      assertInvitationsAllowed();
      const input = addAdminMembershipSchema.parse(rawInput);
      await approveWorkspaceAccessTx(tx, {
        ...input,
        organizationId: access.organizationId,
        actorUserId: access.userId,
      });
    });
  });
}
