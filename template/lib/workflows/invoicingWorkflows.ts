import {
  createInvoice,
  updateInvoiceStatus,
} from "@/lib/actions/invoicingActions";
import {
  getExpenses,
  getInvoice,
  getInvoices,
} from "@/lib/fetchers/invoicingFetchers";
import { calculateInvoiceTotals, calculateTaxes } from "@/lib/utils/invoicing";
import type {
  FinalizeInvoiceCommand,
  InvoiceCalculationLine,
} from "@/types/invoicingTypes";

export const createInvoiceWorkflow = createInvoice;
export const updateInvoiceStatusWorkflow = updateInvoiceStatus;
export { calculateInvoiceTotals, calculateTaxes };

export async function calculateInvoiceTotalsWorkflow(
  lines: InvoiceCalculationLine[],
) {
  return calculateInvoiceTotals(lines);
}

export async function calculateTaxesWorkflow(
  subtotal: string,
  taxRate: string,
) {
  return calculateTaxes(subtotal, taxRate);
}

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
