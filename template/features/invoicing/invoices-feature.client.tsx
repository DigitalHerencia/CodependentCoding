"use client";
import { InvoicesToolbar } from "@/components/blocks/invoicing-blocks";
import { useState } from "react";
import { InvoicingInvoicesTemplate } from "@/components/templates/invoicing-templates";
import type { InvoiceDTO } from "@/types/invoicingTypes";
export function InvoicesFeatureClient({
  invoices,
}: {
  invoices: InvoiceDTO[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  return (
    <InvoicingInvoicesTemplate
      invoices={invoices.filter(
        (invoice) =>
          (!status || invoice.status === status) &&
          `${invoice.number} ${invoice.customerName}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      )}
      toolbar={
        <InvoicesToolbar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          statuses={[...new Set(invoices.map((invoice) => invoice.status))]}
        />
      }
    />
  );
}
