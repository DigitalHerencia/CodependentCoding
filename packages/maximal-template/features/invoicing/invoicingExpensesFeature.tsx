import { InvoicingExpensesTemplate } from "@/components/templates/invoicing-templates";
import { loadExpensesWorkflow } from "@/lib/workflows/invoicingWorkflows";
/** Expense list orchestrates persisted data without a nested dashboard shell. */
export async function InvoicingExpensesFeature({ query }: { query: unknown }) {
  const view = await loadExpensesWorkflow(query);
  return (
    <InvoicingExpensesTemplate
      {...view}
      canCreate={view.permissions.canCreate}
    />
  );
}
