import { loadInvoiceEditWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { NewInvoiceForm } from "./newInvoiceForm";

export async function InvoiceEditFeature({ invoiceId }: { invoiceId: string }) {
  const { invoice } = await loadInvoiceEditWorkflow({ invoiceId });
  return <NewInvoiceForm invoice={invoice} />;
}
