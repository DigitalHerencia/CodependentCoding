import { getInvoice } from "../../fetchers/invoicingFetchers";
import { determineInvoiceStatus } from "../../invoicing/logic/determine-invoice-status.logic";
export async function determineInvoiceStatusWorkflow(invoiceId: string, now = new Date()) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) throw new Error("Invoice was not found.");
  return determineInvoiceStatus({
    status: invoice.status,
    dueAt: invoice.dueAt ? new Date(invoice.dueAt) : null,
    paidAt: invoice.paidAt ? new Date(invoice.paidAt) : null,
    now,
  });
}
