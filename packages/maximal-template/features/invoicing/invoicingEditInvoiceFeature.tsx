import { InvoicingUnavailableTemplate } from "@/components/templates/invoicing-templates";
import { loadInvoiceEditWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { InvoicingEditInvoiceForm } from "./invoicingEditInvoiceForm";
/** Edit entry checks permission and persisted editability before RHF is mounted. */
export async function InvoicingEditInvoiceFeature({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const { invoice, permissions } = await loadInvoiceEditWorkflow({ invoiceId });
  return permissions.canUpdate &&
    invoice.status === "DRAFT" &&
    !invoice.approvedAt ? (
    <InvoicingEditInvoiceForm invoice={invoice} />
  ) : (
    <InvoicingUnavailableTemplate edit />
  );
}
