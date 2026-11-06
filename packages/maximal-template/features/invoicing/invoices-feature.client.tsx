"use client";

import { InvoicingInvoicesTemplate } from "@/components/templates/invoicing-templates";
import { selectInvoicesWorkflow } from "@/lib/workflows/invoicingClientWorkflows";
import type { InvoiceDTO } from "@/types/invoicingTypes";
import { useState } from "react";

export function InvoicesFeatureClient({
  invoices,
}: {
  invoices: InvoiceDTO[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  return (
    <InvoicingInvoicesTemplate
      invoices={selectInvoicesWorkflow(invoices, query, status)}
      toolbarProps={{
        query: query,
        onQueryChange: setQuery,
        status: status,
        onStatusChange: setStatus,
        statuses: [...new Set(invoices.map((invoice) => invoice.status))],
      }}
    />
  );
}
