"use client";
import type { InvoiceDTO } from "@/types/invoicingTypes";
import { InvoicingInvoiceForm } from "./invoicingNewInvoiceForm";
/** Edit uses the shared RHF state owner with the persisted optimistic version. */
export function InvoicingEditInvoiceForm({ invoice }: { invoice: InvoiceDTO }) {
  return <InvoicingInvoiceForm invoice={invoice} />;
}
