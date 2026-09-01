import { calculateTaxes } from "../../invoicing/logic/calculate-taxes.logic";
export async function calculateTaxesWorkflow(
  subtotal: string,
  taxRate: string,
) {
  return calculateTaxes(subtotal, taxRate);
}
