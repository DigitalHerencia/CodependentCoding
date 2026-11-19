"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { invoicingCopy as copy } from "@/content/invoicing";
import type {
  ExpenseDTO,
  InvoiceDTO,
  InvoiceListDTO,
  InvoicingQuery,
  InvoicingPagination,
  InvoicingSummary,
} from "@/types/invoicingTypes";
import Link from "next/link";
import type { FormEventHandler, ReactNode, Ref } from "react";

/** Presentation contract for GET filters; normalized by the server workflow. */
type Criteria = InvoicingQuery;
type PageInfo = InvoicingPagination;
type Summary = InvoicingSummary[number];
type Mode = "invoices" | "expenses";

/** Tenant-page heading; the tenant layout supplies the surrounding shell. */
export function InvoicingHeadingBlock({
  mode,
  create = false,
  title,
}: {
  mode: Mode;
  create?: boolean;
  title?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="type-title">{title ?? copy[mode]}</h1>
      {create && (
        <Button asChild>
          <Link href={`/${mode}/new`}>
            {mode === "invoices" ? copy.newInvoice : copy.newExpense}
          </Link>
        </Button>
      )}
    </header>
  );
}

/** Accessible URL-based filters submit to the authorized database query. */
export function InvoicingFiltersBlock({
  mode,
  query,
}: {
  mode: Mode;
  query: Criteria;
}) {
  const statuses =
    mode === "invoices"
      ? ["DRAFT", "OPEN", "PAID", "VOID", "OVERDUE"]
      : ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "REIMBURSED"];
  return (
    <form
      action={`/${mode}`}
      method="get"
      className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <Field>
        <FieldLabel htmlFor="ledger-search">{copy.search}</FieldLabel>
        <Input
          id="ledger-search"
          name="search"
          defaultValue={query.search}
          maxLength={200}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="ledger-status">
          {mode === "invoices" ? copy.status : copy.expenseStatus}
        </FieldLabel>
        <NativeSelect
          id="ledger-status"
          name="status"
          defaultValue={query.status}
        >
          <NativeSelectOption value="">{copy.all}</NativeSelectOption>
          {statuses.map((status) => (
            <NativeSelectOption key={status} value={status}>
              {status}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="ledger-currency">{copy.currency}</FieldLabel>
        <Input
          id="ledger-currency"
          name="currency"
          defaultValue={query.currency}
          maxLength={3}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="ledger-sort">{copy.sort}</FieldLabel>
        <NativeSelect id="ledger-sort" name="sort" defaultValue={query.sort}>
          {Object.entries(copy.sortOptions).map(([value, label]) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="ledger-from">{copy.from}</FieldLabel>
        <Input
          type="date"
          id="ledger-from"
          name="from"
          defaultValue={query.from}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="ledger-to">{copy.to}</FieldLabel>
        <Input type="date" id="ledger-to" name="to" defaultValue={query.to} />
      </Field>
      <input type="hidden" name="pageSize" value={query.pageSize} />
      <div className="flex items-end gap-3">
        <Button type="submit">{copy.apply}</Button>
        <Link className="type-link" href={`/${mode}`}>
          {copy.reset}
        </Link>
      </div>
    </form>
  );
}

/** Full-query aggregates retain separate currencies and persisted lifecycle states. */
export function InvoicingSummaryBlock({
  mode,
  summary,
  query,
}: {
  mode: Mode;
  summary: Summary[];
  query: Criteria;
}) {
  return (
    <section className="space-y-3" aria-label={copy.summary}>
      <p className="type-caption">{copy.scope}</p>
      <p className="type-caption">
        {mode === "invoices" ? copy.invoiceRange : copy.expenseRange}:{" "}
        {query.from || copy.noStart} – {query.to || copy.noEnd}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card
            className="space-y-2 p-4"
            key={`${item.currency}-${item.status}`}
          >
            <h2 className="type-label">
              {mode === "expenses"
                ? copy.expenseAmount
                : item.status === "PAID"
                  ? copy.markedPaid
                  : ["OPEN", "OVERDUE"].includes(item.status)
                    ? copy.receivable
                    : copy.invoiceTotal}
            </h2>
            <p className="type-title">
              {item.total} {item.currency}
            </p>
            <p>
              {item.status} · {item.count}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/** Financial DTO table: render untrusted names and descriptions as text. */
export function InvoicingInvoicesTableBlock({
  invoices,
}: {
  invoices: Array<InvoiceListDTO & { overdue?: boolean }>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{copy.invoices}</caption>
        <thead>
          <tr>
            {[
              copy.number,
              copy.customer,
              copy.amount,
              copy.status,
              copy.approval,
              copy.due,
            ].map((label) => (
              <th className="p-3" scope="col" key={label}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr className="border-t" key={invoice.id}>
              <td className="p-3">
                <Link className="type-link" href={`/invoices/${invoice.id}`}>
                  #{invoice.number}
                </Link>
              </td>
              <td className="p-3">{invoice.customerName}</td>
              <td className="p-3 whitespace-nowrap">
                {invoice.total} {invoice.currency}
              </td>
              <td className="p-3">
                {invoice.status}
                {invoice.overdue && invoice.status !== "OVERDUE"
                  ? ` · ${copy.overdue}`
                  : ""}
              </td>
              <td className="p-3">
                {invoice.approvedAt ? copy.approved : copy.unapproved}
              </td>
              <td className="p-3">{invoice.dueAt ?? copy.unavailable}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!invoices.length && <p className="p-4">{copy.empty}</p>}
    </div>
  );
}

/** Expense ledger preserves recorded reimbursement status without implying payment. */
export function InvoicingExpensesTableBlock({
  expenses,
}: {
  expenses: ExpenseDTO[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{copy.expenses}</caption>
        <thead>
          <tr>
            {[
              copy.vendor,
              copy.description,
              copy.amount,
              copy.expenseStatus,
              copy.incurred,
            ].map((label) => (
              <th className="p-3" scope="col" key={label}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr className="border-t" key={expense.id}>
              <td className="p-3">
                <Link className="type-link" href={`/expenses/${expense.id}`}>
                  {expense.vendor}
                </Link>
              </td>
              <td className="p-3">{expense.description}</td>
              <td className="p-3 whitespace-nowrap">
                {expense.amount} {expense.currency}
              </td>
              <td className="p-3">{expense.status}</td>
              <td className="p-3">{expense.incurredAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!expenses.length && <p className="p-4">{copy.empty}</p>}
    </div>
  );
}

/** Pagination retains the entire server-normalized filter and sort scope. */
export function InvoicingPaginationBlock({
  mode,
  query,
  pagination,
}: {
  mode: Mode;
  query: Criteria;
  pagination: PageInfo;
}) {
  const href = (page: number) =>
    `/${mode}?${new URLSearchParams(Object.entries({ ...query, page }).map(([key, value]) => [key, String(value)]))}`;
  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3"
      aria-label={`${copy[mode]} pages`}
    >
      <p>
        {pagination.page} / {Math.max(1, pagination.totalPages)} ·{" "}
        {pagination.total}
      </p>
      <div className="flex gap-4">
        {pagination.page > 1 && (
          <Link className="type-link" href={href(pagination.page - 1)}>
            {copy.previous}
          </Link>
        )}
        {pagination.page < pagination.totalPages && (
          <Link className="type-link" href={href(pagination.page + 1)}>
            {copy.next}
          </Link>
        )}
      </div>
    </nav>
  );
}

/** Persisted invoice facts and line amounts; lifecycle actions arrive as a slot. */
export function InvoicingInvoiceDetailBlock({
  invoice,
  canEdit,
  children,
}: {
  invoice: InvoiceDTO;
  canEdit: boolean;
  children?: ReactNode;
}) {
  return (
    <Card className="space-y-6 p-6">
      <header className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="type-title">
            {copy.number} #{invoice.number}
          </h1>
          <p>{invoice.status}</p>
        </div>
        <div className="flex gap-4">
          <Link className="type-link" href="/invoices">
            {copy.back}
          </Link>
          {canEdit && (
            <Link className="type-link" href={`/invoices/${invoice.id}/edit`}>
              {copy.edit}
            </Link>
          )}
        </div>
      </header>
      <section>
        <h2 className="type-label">{copy.customer}</h2>
        <p>{invoice.customerName}</p>
        <p>{invoice.customerEmail}</p>
      </section>
      <dl className="grid gap-2 sm:grid-cols-2">
        {[
          [copy.issuedAt, invoice.issuedAt],
          [copy.dueAt, invoice.dueAt],
          [copy.approvedAt, invoice.approvedAt],
          [copy.approvedBy, invoice.approvedBy?.displayName],
          [copy.paidAt, invoice.paidAt],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="type-label">{label}</dt>
            <dd>{value ?? copy.unavailable}</dd>
          </div>
        ))}
      </dl>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{copy.lines}</caption>
          <thead>
            <tr>
              {[
                copy.description,
                copy.quantity,
                copy.unitPrice,
                copy.taxRate,
                copy.lineSubtotal,
                copy.lineTax,
                copy.lineTotal,
              ].map((label) => (
                <th className="p-2" scope="col" key={label}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line) => (
              <tr key={line.id} className="border-t">
                {[
                  line.description,
                  line.quantity,
                  line.unitPrice,
                  line.taxRate,
                  line.lineSubtotal,
                  line.lineTax,
                  line.lineTotal,
                ].map((value, index) => (
                  <td className="p-2" key={index}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InvoicingTotalsBlock totals={invoice} currency={invoice.currency} />
      {children}
    </Card>
  );
}

/** Direct authorized expense detail, including only permitted DTO fields. */
export function InvoicingExpenseDetailBlock({
  expense,
  canEdit,
}: {
  expense: ExpenseDTO;
  canEdit: boolean;
}) {
  return (
    <Card className="space-y-5 p-6">
      <h1 className="type-title">{expense.vendor}</h1>
      <div className="flex gap-4">
        <Link className="type-link" href="/expenses">
          {copy.back}
        </Link>
        {canEdit && (
          <Link className="type-link" href={`/expenses/${expense.id}/edit`}>
            {copy.edit}
          </Link>
        )}
      </div>
      <p className="whitespace-pre-wrap">{expense.description}</p>
      <dl className="grid gap-4 sm:grid-cols-2">
        {[
          [copy.amount, `${expense.amount} ${expense.currency}`],
          [copy.expenseStatus, expense.status],
          [copy.incurred, expense.incurredAt],
          [copy.submitter, expense.submitter],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="type-label">{label}</dt>
            <dd>{value ?? copy.unavailable}</dd>
          </div>
        ))}
      </dl>
      <p className="type-caption">{copy.expenseNote}</p>
    </Card>
  );
}

/** Command presentation receives permission-checked availability from its feature. */
export function InvoicingCommandsBlock({
  canApprove,
  canIssue,
  pending,
  message,
  onCommand,
}: {
  canApprove: boolean;
  canIssue: boolean;
  pending: boolean;
  message: string;
  onCommand: (command: "approve" | "issue") => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {canApprove && (
          <Button disabled={pending} onClick={() => onCommand("approve")}>
            {copy.approve}
          </Button>
        )}
        {canIssue && (
          <Button disabled={pending} onClick={() => onCommand("issue")}>
            {copy.issue}
          </Button>
        )}
      </div>
      <p className="type-caption">{copy.commandNote}</p>
      <p role="status" aria-live="polite">
        {message === "updated"
          ? copy.updated
          : message === "error"
            ? copy.commandError
            : message}
      </p>
    </section>
  );
}

/** Structural RHF binding; blocks never import form state or application logic. */
type Binding = {
  name: string;
  value: unknown;
  onChange: (...event: unknown[]) => void;
  onBlur: () => void;
  ref: Ref<HTMLInputElement>;
};
export function InvoicingFieldBlock({
  name,
  binding,
  invalid,
  error,
  index,
}: {
  name: string;
  binding: Binding;
  invalid?: boolean;
  error?: string | undefined;
  index?: number;
}) {
  const labels: Record<string, string> = {
    customerName: copy.customerName,
    customerEmail: copy.customerEmail,
    currency: copy.currency,
    issuedAt: copy.issuedAt,
    dueAt: copy.dueAt,
    description: index === undefined ? copy.businessPurpose : copy.description,
    quantity: copy.quantity,
    unitPrice: copy.unitPrice,
    taxRate: copy.taxRate,
    vendor: copy.vendor,
    amount: copy.amount,
    incurredAt: copy.incurredAt,
  };
  const id = `invoicing-${index ?? "header"}-${name}`;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{labels[name]}</FieldLabel>
      <Input
        {...binding}
        id={id}
        value={String(binding.value ?? "")}
        type={
          name.endsWith("At")
            ? "date"
            : name === "customerEmail"
              ? "email"
              : "text"
        }
        inputMode={
          ["quantity", "unitPrice", "taxRate", "amount"].includes(name)
            ? "decimal"
            : "text"
        }
        aria-invalid={invalid}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}

/** A line-item container delegates all field array operations to the form. */
export function InvoicingLineBlock({
  index,
  children,
  onRemove,
  disabled,
}: {
  index: number;
  children: ReactNode;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-5">
      <legend className="px-2">
        {copy.lines} {index + 1}
      </legend>
      {children}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        aria-label={`${copy.removeLine} ${index + 1}`}
        onClick={onRemove}
      >
        {copy.removeLine}
      </Button>
    </fieldset>
  );
}

/** Decimal strings are displayed without floating-point currency conversion. */
export function InvoicingTotalsBlock({
  totals,
  currency,
  preview = false,
}: {
  totals: { subtotal: string; taxTotal: string; total: string } | null;
  currency: string;
  preview?: boolean;
}) {
  return (
    <section aria-live={preview ? "polite" : undefined}>
      {preview && <h2 className="type-label">{copy.preview}</h2>}
      {totals ? (
        <dl className="ml-auto grid max-w-sm grid-cols-2 gap-2">
          {[
            [copy.subtotal, totals.subtotal],
            [copy.taxTotal, totals.taxTotal],
            [copy.total, totals.total],
          ].map(([label, value]) => (
            <div className="contents" key={label}>
              <dt>{label}</dt>
              <dd className="text-right">
                {value} {currency}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>{copy.previewInvalid}</p>
      )}
    </section>
  );
}

/** Shared form scaffold: RHF state, field arrays and submission remain in forms. */
export function InvoicingFormBlock({
  mode,
  edit,
  fields,
  lines,
  onAddLine,
  preview,
  pending,
  error,
  locked,
  onSubmit,
}: {
  mode: Mode;
  edit: boolean;
  fields: ReactNode;
  lines?: ReactNode;
  onAddLine?: () => void;
  preview?: ReactNode;
  pending: boolean;
  error?: string | undefined;
  locked?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form
      className="mx-auto max-w-5xl space-y-5 rounded-lg border p-5"
      noValidate
      onSubmit={onSubmit}
    >
      <h1 className="type-title">
        {mode === "invoices"
          ? edit
            ? copy.editInvoice
            : copy.newInvoice
          : edit
            ? copy.editExpense
            : copy.newExpense}
      </h1>
      <fieldset disabled={pending || locked} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">{fields}</div>
        {lines}
        {onAddLine && (
          <Button type="button" variant="outline" onClick={onAddLine}>
            {copy.addLine}
          </Button>
        )}
        {preview}
      </fieldset>
      {locked && <p role="alert">{copy.editLocked}</p>}
      {error && (
        <p role="alert">{error === "error" ? copy.saveError : error}</p>
      )}
      <div className="flex gap-4">
        <Button type="submit" disabled={pending || locked}>
          {pending
            ? copy.saving
            : mode === "invoices"
              ? copy.saveInvoice
              : copy.saveExpense}
        </Button>
        <Link className="type-link" href={`/${mode}`}>
          {copy.back}
        </Link>
      </div>
    </form>
  );
}

/** Permission denial is presented without a second auth or onboarding gate. */
export function InvoicingUnavailableBlock({
  edit = false,
}: {
  edit?: boolean;
}) {
  return <p role="alert">{edit ? copy.editLocked : copy.noAccess}</p>;
}

/** Skeleton blocks are imported directly by route-specific skeleton components. */
export function InvoicingSkeletonBlock() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      <Skeleton className="h-10 w-60" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
