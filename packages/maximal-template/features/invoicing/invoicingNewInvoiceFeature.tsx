import { loadNewInvoiceWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { InvoicingNewInvoiceForm } from "./invoicingNewInvoiceForm";
/** Tenant layout owns sign-in; the workflow independently enforces invoice creation. */
export async function InvoicingNewInvoiceFeature() {
  await loadNewInvoiceWorkflow();
  return <InvoicingNewInvoiceForm />;
}
