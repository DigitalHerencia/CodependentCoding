"use server";
import "server-only";
import { notFound } from "next/navigation";
import {
  getInvoicePage,
  getExpensePage,
  getInvoicesPage,
  getExpensesPage,
  getNewInvoiceContext,
  getNewExpenseContext,
} from "@/lib/fetchers/invoicingFetchers";
import {
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  approveInvoice,
  issueApprovedInvoice,
  createExpense,
  updateExpense,
} from "@/lib/actions/invoicingActions";
/** Compose authorized bounded invoices and full filtered-scope summaries. */
export async function loadInvoicesWorkflow(query: unknown = {}) {
  return getInvoicesPage(query);
}
/** Compose authorized bounded expenses and full filtered-scope summaries. */
export async function loadExpensesWorkflow(query: unknown = {}) {
  return getExpensesPage(query);
}
/** Load one invoice directly, preserving current authorization for presentation. */
export async function loadInvoiceWorkflow({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const result = await getInvoicePage(invoiceId);
  if (!result.invoice) notFound();
  return { ...result, invoice: result.invoice };
}
/** Load editable invoice data; mutation boundaries independently enforce draft state. */
export async function loadInvoiceEditWorkflow(input: { invoiceId: string }) {
  return loadInvoiceWorkflow(input);
}
/** Load one expense directly with current authorization for presentation. */
export async function loadExpenseWorkflow({
  expenseId,
}: {
  expenseId: string;
}) {
  const result = await getExpensePage(expenseId);
  if (!result.expense) notFound();
  return { ...result, expense: result.expense };
}
/** Load editable expense data; mutation boundaries independently enforce reviewed state. */
export async function loadExpenseEditWorkflow(input: { expenseId: string }) {
  return loadExpenseWorkflow(input);
}
/** Create a validated draft through its authorized action. */
export async function createInvoiceWorkflow(input: unknown) {
  return createInvoice(input);
}
/** Replace current unapproved draft contents atomically. */
export async function updateInvoiceWorkflow(input: unknown) {
  return updateInvoice(input);
}
/** Return a safe validation failure for terminal updates pending owner policy. */
export async function updateInvoiceStatusWorkflow(input: unknown) {
  return updateInvoiceStatus(input);
}
/** Record approval using established invoice update authority. */
export async function approveInvoiceWorkflow(input: unknown) {
  return approveInvoice(input);
}
/** Issue the currently approved draft using the dedicated transition. */
export async function issueApprovedInvoiceWorkflow(input: unknown) {
  return issueApprovedInvoice(input);
}
/** Submit a validated expense through its authorized action. */
export async function createExpenseWorkflow(input: unknown) {
  return createExpense(input);
}
/** Update a current, unreviewed expense through its authorized action. */
export async function updateExpenseWorkflow(input: unknown) {
  return updateExpense(input);
}

/** Authorize invoice creation before composing its form. */
export async function loadNewInvoiceWorkflow() {
  return getNewInvoiceContext();
}
/** Authorize expense creation before composing its form. */
export async function loadNewExpenseWorkflow() {
  return getNewExpenseContext();
}
