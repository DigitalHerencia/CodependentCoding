// Why: Templates: pure presentation for the invoicing pages, laid out from DTOs; data and slots come from features.
import Link from "next/link";
import type { ExpenseDTO, InvoiceDTO } from "@/types/invoicingTypes";
import type { ReactNode } from "react";
import {
  DashboardLayout,
  DashboardTable,
} from "@/components/blocks/dashboard-layout";

export function InvoicingExpenseDetailTemplate({
  expense,
}: {
  expense: ExpenseDTO;
}) {
  return (
    <article className="mx-auto max-w-3xl space-y-6 surface-card p-6">
      <header>
        <p className="type-caption">EXPENSE</p>
        <h1 className="type-title">{expense.vendor}</h1>
        <p className="mt-4 text-3xl">
          {expense.amount} {expense.currency}
        </p>
      </header>
      <dl className="grid grid-cols-2 gap-4">
        <dt>Incurred</dt>
        <dd>{expense.incurredAt.slice(0, 10)}</dd>
        <dt>Submitted by</dt>
        <dd>{expense.submitter ?? "Not recorded"}</dd>
        <dt>Review status</dt>
        <dd>{expense.status}</dd>
      </dl>
      <section>
        <h2 className="type-label">Business purpose</h2>
        <p className="mt-3 whitespace-pre-wrap">
          {expense.description ?? "Not recorded"}
        </p>
      </section>
      {["DRAFT", "SUBMITTED"].includes(expense.status) && (
        <Link className="type-link" href={`/expenses/${expense.id}/edit`}>
          Edit expense
        </Link>
      )}
    </article>
  );
}

export function InvoicingExpensesTemplate({
  expenses,
  toolbar,
}: {
  expenses: ExpenseDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Expense ledger" nav={[]} toolbar={toolbar}>
      <DashboardTable
        columns={[
          { key: "vendor", label: "Vendor" },
          { key: "purpose", label: "Business purpose" },
          { key: "amount", label: "Amount" },
          { key: "date", label: "Incurred" },
          { key: "submitter", label: "Submitted by" },
          { key: "review", label: "Review status" },
        ]}
        rows={expenses.map((expense) => ({
          id: expense.id,
          href: `/expenses/${expense.id}`,
          cells: {
            vendor: expense.vendor,
            purpose: expense.description,
            amount: `${expense.amount} ${expense.currency}`,
            date: expense.incurredAt.slice(0, 10),
            submitter: expense.submitter,
            review: expense.status,
          },
        }))}
      />
    </DashboardLayout>
  );
}

export function InvoicingInvoiceDetailTemplate({
  invoice,
  children,
}: {
  invoice: InvoiceDTO;
  children?: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-5xl space-y-8 surface-card p-6">
      <header className="flex flex-wrap justify-between gap-5 border-b border-border pb-6">
        <div>
          <p className="type-caption">INVOICE</p>
          <h1 className="type-title">#{invoice.number}</h1>
          <p>{invoice.status}</p>
        </div>
        <div>
          <p>Issued: {invoice.issuedAt?.slice(0, 10) ?? "Not dated"}</p>
          <p>Due: {invoice.dueAt?.slice(0, 10) ?? "Not dated"}</p>
          {invoice.status === "DRAFT" && !invoice.approvedAt && (
            <Link className="type-link" href={`/invoices/${invoice.id}/edit`}>
              Edit draft
            </Link>
          )}
        </div>
      </header>
      <section>
        <h2 className="type-label">Bill to</h2>
        <p className="mt-2 text-xl">{invoice.customerName}</p>
        <p>{invoice.customerEmail}</p>
      </section>
      <DashboardTable
        columns={[
          { key: "description", label: "Description" },
          { key: "quantity", label: "Quantity" },
          { key: "price", label: "Unit price" },
          { key: "tax", label: "Tax" },
          { key: "total", label: "Line total" },
        ]}
        rows={invoice.lines.map((line) => ({
          id: line.id,
          cells: {
            description: line.description,
            quantity: line.quantity,
            price: line.unitPrice,
            tax: line.lineTax,
            total: line.lineTotal,
          },
        }))}
      />
      <dl className="ml-auto grid max-w-sm grid-cols-2 gap-3 text-right">
        <dt>Subtotal</dt>
        <dd>{invoice.subtotal}</dd>
        <dt>Tax</dt>
        <dd>{invoice.taxTotal}</dd>
        <dt className="type-title">Total</dt>
        <dd className="type-title">
          {invoice.total} {invoice.currency}
        </dd>
      </dl>
      {children}
    </article>
  );
}

export function InvoicingInvoicesTemplate({
  invoices,
  toolbar,
}: {
  invoices: InvoiceDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Accounts receivable" nav={[]} toolbar={toolbar}>
      <p>Track customer invoices and due dates. Showing up to 100 invoices.</p>
      <DashboardTable
        columns={[
          { key: "number", label: "Invoice" },
          { key: "customer", label: "Customer" },
          { key: "total", label: "Amount" },
          { key: "status", label: "Payment status" },
          { key: "due", label: "Due date" },
        ]}
        rows={invoices.map((invoice) => ({
          id: invoice.id,
          href: `/invoices/${invoice.id}`,
          cells: {
            number: `#${invoice.number}`,
            customer: invoice.customerName,
            total: `${invoice.total} ${invoice.currency}`,
            status: invoice.status,
            due: invoice.dueAt?.slice(0, 10) ?? "Not set",
          },
        }))}
        emptyLabel="No matching invoices."
      />
    </DashboardLayout>
  );
}
