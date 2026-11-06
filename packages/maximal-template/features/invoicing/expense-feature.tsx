import { InvoicingExpenseDetailTemplate } from "@/components/templates/invoicing-templates";
import { loadExpenseWorkflow } from "@/lib/workflows/invoicingWorkflows";

export async function ExpenseFeature({ expenseId }: { expenseId: string }) {
  const { expense } = await loadExpenseWorkflow({ expenseId });
  return <InvoicingExpenseDetailTemplate expense={expense} />;
}
