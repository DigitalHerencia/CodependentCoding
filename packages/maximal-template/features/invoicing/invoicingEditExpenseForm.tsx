"use client";
import type { ExpenseDTO } from "@/types/invoicingTypes";
import { InvoicingExpenseForm } from "./invoicingNewExpenseForm";
/** Edit form shares RHF validation and retains the expected persistence timestamp. */
export function InvoicingEditExpenseForm({ expense }: { expense: ExpenseDTO }) {
  return <InvoicingExpenseForm expense={expense} />;
}
