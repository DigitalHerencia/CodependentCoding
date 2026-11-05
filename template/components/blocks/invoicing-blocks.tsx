"use client";
import { invoicingBlockCopy } from "@/content/invoicing";
import Link from "next/link";
import { Input } from "@/components/ui/input";
export function ExpensesToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={invoicingBlockCopy.searchExpenses}
        placeholder={invoicingBlockCopy.searchVendorOrPurpose}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Link className="type-link" href="/expenses/new">
        {invoicingBlockCopy.submitExpense}
      </Link>
    </div>
  );
}
export function InvoicesToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  statuses,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={invoicingBlockCopy.searchInvoices}
        placeholder={invoicingBlockCopy.searchInvoiceOrCustomer}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <select
        className="control-field"
        aria-label={invoicingBlockCopy.invoiceStatus}
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="">{invoicingBlockCopy.allStatuses}</option>
        {statuses.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <Link className="type-link" href="/invoices/new">
        {invoicingBlockCopy.draftInvoice}
      </Link>
    </div>
  );
}
import { Button } from "@/components/ui/button";

import type { InvoiceDTO } from "@/types/invoicingTypes";

export function InvoiceControlsBlock({
  invoice,
  pending,
  message,
  onApproveOrIssue,
}: {
  invoice: InvoiceDTO;
  pending: boolean;
  message: string;
  onApproveOrIssue: () => void | Promise<void>;
}) {
  return (
    <div className="space-y-3">
      <Button disabled={pending} onClick={onApproveOrIssue}>
        {invoice.approvedAt
          ? invoicingBlockCopy.issueApprovedInvoice
          : invoicingBlockCopy.approveInvoice}
      </Button>
      <p className="text-sm text-muted-primary">
        {
          invoicingBlockCopy.issuingRecordsThisInvoiceAsOpenItDoesNotEmailTheCustomerOrChargeAPaymentMethod
        }
      </p>
      <p role="status">{message}</p>
    </div>
  );
}
