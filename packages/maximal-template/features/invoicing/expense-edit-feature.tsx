import { loadExpenseEditWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { NewExpenseForm } from "./newExpenseForm";

export async function ExpenseEditFeature({ expenseId }: { expenseId: string }) {
  const { expense } = await loadExpenseEditWorkflow({ expenseId });
  return <NewExpenseForm expense={expense} />;
}
