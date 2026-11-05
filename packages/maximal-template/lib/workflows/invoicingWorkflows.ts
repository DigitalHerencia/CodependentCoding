import "server-only";

import { getExpenses, getInvoices } from "@/lib/fetchers/invoicingFetchers";

export async function getInvoicingWorkspaceWorkflow(limit = 50) {
  const [invoices, expenses] = await Promise.all([
    getInvoices(limit),
    getExpenses(limit),
  ]);
  return { invoices, expenses };
}

export async function getExpenseWorkflow(expenseId: string) {
  const expenses = await getExpenses(100);
  return expenses.find((expense) => expense.id === expenseId) ?? null;
}
