import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toExpenseDTO } from "../../db/dto/invoicing.dto";
import { withTenantTransaction } from "../../db/tenant";
import { submitExpenseTx } from "../../db/transactions/invoicingTransactions";

export async function submitExpenseWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    receiptAssetId?: string | null;
    vendor: string;
    description?: string | null;
    amount: string;
    currency: string;
    incurredAt: Date;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing:write");
    return toExpenseDTO(
      await submitExpenseTx(tx, {
        organizationId: access.organizationId,
        submittedByMembershipId: access.membershipId,
        ...command,
      }),
    );
  });
}
