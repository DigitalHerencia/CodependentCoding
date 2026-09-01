import { calculateInvoiceTotals } from "../../invoicing/logic/calculate-invoice-totals.logic";
export async function calculateInvoiceTotalsWorkflow(
  lines: Array<{ quantity: string; unitPrice: string; taxRate: string }>,
) {
  return calculateInvoiceTotals(lines);
}
