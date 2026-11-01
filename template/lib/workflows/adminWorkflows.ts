import "server-only";

import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toAdminMembershipDTO } from "@/lib/db/dto/admin.dto";
import { withTenantTransaction } from "@/lib/db/tenant";
import { updateMembershipAdministrationTx } from "@/lib/db/transactions/admin.tx";
import { InvariantViolationError } from "@/lib/db/transactions/errors";
import type { AdminBulkOperation } from "@/types/adminTypes";
import {
  getAdminMemberships,
  getAdminRecordSummary,
  getAuditEvents,
} from "@/lib/fetchers/adminFetchers";

export async function getAdminWorkspaceWorkflow() {
  const [auditEvents, memberships, records] = await Promise.all([
    getAuditEvents(),
    getAdminMemberships(),
    getAdminRecordSummary(),
  ]);
  return { auditEvents, memberships, records };
}

/** Every command commits together or none does; an administrator never changes their own membership. */
export async function executeBulkOperationWorkflow(
  commands: readonly AdminBulkOperation[],
) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin.membership:update");
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
}
