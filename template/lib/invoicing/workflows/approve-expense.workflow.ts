import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toExpenseDTO } from "../../db/dto/invoicing.dto";
import { withTenantTransaction } from "../../db/tenant";
import { approveExpenseTx } from "../../db/transactions/invoicingTransactions";

export async function approveExpenseWorkflow(
  identity: AuthenticatedIdentity,
  command: { expenseId: string },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing:write");
    return toExpenseDTO(
      await approveExpenseTx(tx, {
        organizationId: access.organizationId,
        expenseId: command.expenseId,
      }),
    );
  });
}
