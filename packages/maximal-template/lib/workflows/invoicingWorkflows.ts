import {
  getExpense,
  getExpenses,
  getInvoice,
  getInvoices,
} from "@/lib/fetchers/invoicingFetchers";
import { notFound } from "next/navigation";
import "server-only";

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

export async function loadExpenseEditWorkflow({
  expenseId,
}: {
  expenseId: string;
}) {
  const expense = await getExpense(expenseId);
  if (!expense) notFound();
  return { expense };
}

export async function loadExpenseWorkflow({
  expenseId,
}: {
  expenseId: string;
}) {
  const expense = await getExpense(expenseId);
  if (!expense) notFound();
  return { expense };
}

export async function loadExpensesWorkflow() {
  const expenses = await getExpenses();
  return { expenses };
}

export async function loadInvoiceEditWorkflow({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) notFound();
  return { invoice };
}

export async function loadInvoiceWorkflow({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) notFound();
  return { invoice };
}

export async function loadInvoicesWorkflow() {
  const invoices = await getInvoices(100);
  return { invoices };
}
