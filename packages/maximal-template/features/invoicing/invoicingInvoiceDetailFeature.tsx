import { InvoicingInvoiceDetailTemplate } from "@/components/templates/invoicing-templates";
import { loadInvoiceWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { InvoicingInvoiceDetailFeatureClient } from "./invoicingInvoiceDetailFeatureClient";
/** Detail uses a direct authorized lookup, independent of list pagination. */
export async function InvoicingInvoiceDetailFeature({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const { invoice, permissions } = await loadInvoiceWorkflow({ invoiceId });
  return (
    <InvoicingInvoiceDetailTemplate
      invoice={invoice}
      canEdit={
        permissions.canUpdate &&
        invoice.status === "DRAFT" &&
        !invoice.approvedAt
      }
    >
      <InvoicingInvoiceDetailFeatureClient
        invoice={invoice}
        canUpdate={permissions.canUpdate}
      />
    </InvoicingInvoiceDetailTemplate>
  );
}
