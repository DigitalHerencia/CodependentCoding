import { InvoicingExpenseDetailTemplate } from "@/components/templates/invoicing-templates";
import { loadExpenseWorkflow } from "@/lib/workflows/invoicingWorkflows";
/** Expense detail exposes existing facts and permitted unreviewed edits. */
export async function InvoicingExpenseDetailFeature({
  expenseId,
}: {
  expenseId: string;
}) {
  const { expense, permissions } = await loadExpenseWorkflow({ expenseId });
  return (
    <InvoicingExpenseDetailTemplate
      expense={expense}
      canEdit={
        permissions.canUpdate && ["DRAFT", "SUBMITTED"].includes(expense.status)
      }
    />
  );
}
