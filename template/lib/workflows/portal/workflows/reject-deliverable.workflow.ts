import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { decidePortalApprovalTx } from "../../db/transactions/portalTransactions";

export async function rejectDeliverableWorkflow(
  identity: AuthenticatedIdentity,
  command: { approvalId: string; note: string },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal:read");
    const approval = await decidePortalApprovalTx(tx, {
      organizationId: access.organizationId,
      reviewerMembershipId: access.membershipId,
      approvalId: command.approvalId,
      decision: "REJECTED",
      note: command.note,
    });
    return {
      ...approval,
      decidedAt: approval.decidedAt?.toISOString() ?? null,
    };
  });
}
