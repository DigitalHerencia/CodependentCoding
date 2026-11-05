"use client";
import { ExpensesToolbar } from "@/components/blocks/invoicing-blocks";
import { useState } from "react";
import { InvoicingExpensesTemplate } from "@/components/templates/invoicing-templates";
import type { ExpenseDTO } from "@/types/invoicingTypes";
export function ExpensesFeatureClient({
  expenses,
}: {
  expenses: ExpenseDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <InvoicingExpensesTemplate
      expenses={expenses.filter((expense) =>
        `${expense.vendor} ${expense.description ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<ExpensesToolbar query={query} onQueryChange={setQuery} />}
    />
  );
}
