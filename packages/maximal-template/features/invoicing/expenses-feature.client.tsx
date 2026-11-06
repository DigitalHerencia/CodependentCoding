"use client";

import { InvoicingExpensesTemplate } from "@/components/templates/invoicing-templates";
import { selectExpensesWorkflow } from "@/lib/workflows/invoicingClientWorkflows";
import type { ExpenseDTO } from "@/types/invoicingTypes";
import { useState } from "react";

export function ExpensesFeatureClient({
  expenses,
}: {
  expenses: ExpenseDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <InvoicingExpensesTemplate
      expenses={selectExpensesWorkflow(expenses, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
    />
  );
}
