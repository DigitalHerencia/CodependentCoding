import { loadNewExpenseWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { InvoicingNewExpenseForm } from "./invoicingNewExpenseForm";
/** New expense route uses the existing tenant shell and expense permission. */
export async function InvoicingNewExpenseFeature() {
  await loadNewExpenseWorkflow();
  return <InvoicingNewExpenseForm />;
}
