import { InvoicingUnavailableTemplate } from "@/components/templates/invoicing-templates";
import { loadExpenseEditWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { InvoicingEditExpenseForm } from "./invoicingEditExpenseForm";
/** Edit entry checks update authority and established expense review boundary. */
export async function InvoicingEditExpenseFeature({
  expenseId,
}: {
  expenseId: string;
}) {
  const { expense, permissions } = await loadExpenseEditWorkflow({ expenseId });
  return permissions.canUpdate &&
    ["DRAFT", "SUBMITTED"].includes(expense.status) ? (
    <InvoicingEditExpenseForm expense={expense} />
  ) : (
    <InvoicingUnavailableTemplate edit />
  );
}
