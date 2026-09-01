import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toInvoiceDTO } from "../../db/dto/invoicing.dto";
import { withTenantTransaction } from "../../db/tenant";
import { approveInvoiceTx } from "../../db/transactions/invoicingTransactions";

export async function approveInvoiceWorkflow(
  identity: AuthenticatedIdentity,
  command: { invoiceId: string; expectedVersion: number },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing:write");
    return toInvoiceDTO(
      await approveInvoiceTx(tx, {
        organizationId: access.organizationId,
        approverMembershipId: access.membershipId,
        ...command,
      }),
    );
  });
}
