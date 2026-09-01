import { updateInvoiceStatus } from "@/lib/actions/invoicingActions";
import {
  getExpenses,
  getInvoice,
  getInvoices,
} from "@/lib/fetchers/invoicingFetchers";
import type { FinalizeInvoiceCommand } from "@/types/invoicingTypes";

export async function getInvoicingWorkspaceWorkflow(limit = 50) {
  const [invoices, expenses] = await Promise.all([
    getInvoices(limit),
    getExpenses(limit),
  ]);
  return { invoices, expenses };
}

export async function finalizeInvoiceWorkflow(input: FinalizeInvoiceCommand) {
  const invoice = await getInvoice(input.invoiceId);
  if (!invoice) throw new Error("Invoice was not found.");
  if (invoice.status !== "DRAFT") {
    throw new Error("Only a draft invoice can be finalized.");
  }
  return updateInvoiceStatus({ ...input, status: "OPEN" });
}
