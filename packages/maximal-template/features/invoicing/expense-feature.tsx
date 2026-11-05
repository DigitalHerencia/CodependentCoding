import { notFound } from "next/navigation";
import { getExpense } from "@/lib/fetchers/invoicingFetchers";
import { InvoicingExpenseDetailTemplate } from "@/components/templates/invoicing-templates";
export async function ExpenseFeature({ expenseId }: { expenseId: string }) {
  const expense = await getExpense(expenseId);
  if (!expense) notFound();
  return <InvoicingExpenseDetailTemplate expense={expense} />;
}
