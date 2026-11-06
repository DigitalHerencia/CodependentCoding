import { InvoicingInvoiceDetailTemplate } from "@/components/templates/invoicing-templates";
import { loadInvoiceWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { InvoiceFeatureClient } from "./invoice-feature.client";

export async function InvoiceFeature({ invoiceId }: { invoiceId: string }) {
  const { invoice } = await loadInvoiceWorkflow({ invoiceId });
  return (
    <InvoicingInvoiceDetailTemplate invoice={invoice}>
      <InvoiceFeatureClient key={invoice.version} invoice={invoice} />
    </InvoicingInvoiceDetailTemplate>
  );
}
