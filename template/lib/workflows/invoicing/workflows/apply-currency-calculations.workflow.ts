import { getInvoice } from "../../fetchers/invoicingFetchers";
import { applyCurrencyCalculations } from "../../invoicing/logic/apply-currency-calculations.logic";
export async function applyCurrencyCalculationsWorkflow(command: {
  invoiceId: string;
  targetCurrency: string;
  exchangeRate: string;
}) {
  const invoice = await getInvoice(command.invoiceId);
  if (!invoice) throw new Error("Invoice was not found.");
  const converted = applyCurrencyCalculations(invoice, command.exchangeRate);
  return {
    sourceCurrency: invoice.currency,
    targetCurrency: command.targetCurrency.toUpperCase(),
    ...converted,
  };
}
