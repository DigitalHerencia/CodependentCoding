import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { requestPortalApprovalTx } from "../../db/transactions/portalTransactions";

export async function requestApprovalWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    documentVersionId: string;
    reviewerMembershipId: string;
    reviewerLabel: string;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal:write");
    const approval = await requestPortalApprovalTx(tx, {
      organizationId: access.organizationId,
      ...command,
    });
    return {
      ...approval,
      decidedAt: approval.decidedAt?.toISOString() ?? null,
    };
  });
}
