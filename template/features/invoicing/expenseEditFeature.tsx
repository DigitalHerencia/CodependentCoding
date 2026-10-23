import { notFound } from "next/navigation";
import { getExpense } from "@/lib/fetchers/invoicingFetchers";
import { ExpenseNewForm } from "./expenseNewForm";
export async function ExpenseEditFeature({ expenseId }: { expenseId: string }) {
  const expense = await getExpense(expenseId);
  if (!expense) notFound();
  return <ExpenseNewForm expense={expense} />;
}
