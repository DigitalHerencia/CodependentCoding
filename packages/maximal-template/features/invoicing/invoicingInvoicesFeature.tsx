import { InvoicingInvoicesTemplate } from "@/components/templates/invoicing-templates";
import { loadInvoicesWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { isInvoiceOverdue } from "@/lib/utils/invoicingMoney";
/** Invoice list orchestrates a bounded authorized page and full-scope summary. */
export async function InvoicingInvoicesFeature({ query }: { query: unknown }) {
  const view = await loadInvoicesWorkflow(query);
  return (
    <InvoicingInvoicesTemplate
      {...view}
      canCreate={view.permissions.canCreate}
      invoices={view.invoices.map((invoice) => ({
        ...invoice,
        overdue: isInvoiceOverdue(invoice),
      }))}
    />
  );
}
