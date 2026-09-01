import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { reconcileAiUsageBillingTx } from "../../db/transactions/aiTransactions";

export async function reconcileUsageBillingWorkflow(
  identity: AuthenticatedIdentity,
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "ai:write");
    return reconcileAiUsageBillingTx(tx, {
      organizationId: access.organizationId,
    });
  });
}
