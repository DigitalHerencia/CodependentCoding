import "server-only";

import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toInvoiceDTO } from "@/lib/db/dto/invoicing.dto";
import { withTenantTransaction } from "@/lib/db/tenant";
import { finalizeInvoiceTx } from "@/lib/db/transactions/invoicing-finalize-invoice.tx";
import { getExpenses, getInvoices } from "@/lib/fetchers/invoicingFetchers";
import type { FinalizeInvoiceCommand } from "@/types/invoicingTypes";

export async function getInvoicingWorkspaceWorkflow(limit = 50) {
  const [invoices, expenses] = await Promise.all([
    getInvoices(limit),
    getExpenses(limit),
  ]);
  return { invoices, expenses };
}

export async function getExpenseWorkflow(expenseId: string) {
  const expenses = await getExpenses(100);
  return expenses.find((expense) => expense.id === expenseId) ?? null;
}

/** Read, check it is a draft, and open it in one transaction (the read and the write cannot drift apart). */
export async function finalizeInvoiceWorkflow(input: FinalizeInvoiceCommand) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing.invoice:update");
    const record = await finalizeInvoiceTx(tx, {
      ...input,
      organizationId: access.organizationId,
      actorUserId: access.userId,
    });
    return toInvoiceDTO(record);
  });
}
