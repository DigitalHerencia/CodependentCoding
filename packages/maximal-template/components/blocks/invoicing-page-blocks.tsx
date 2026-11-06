import {
  ExpensesToolbar,
  InvoicesToolbar,
} from "@/components/blocks/invoicing-blocks";
import { DashboardTable } from "@/components/blocks/shared-blocks";
import { Card } from "@/components/ui/card";
import {
  invoicingPresentationCopy,
  invoicingUiCopy,
} from "@/content/invoicing";
import type { ExpenseDTO, InvoiceDTO } from "@/types/invoicingTypes";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Why: Templates: pure presentation for the invoicing pages, laid out from DTOs; data and slots come from features.

export function InvoicingExpenseDetailPageBlock({
  expense,
}: {
  expense: ExpenseDTO;
}) {
  return (
    <Card className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <p className="type-caption">{invoicingPresentationCopy.eXPENSE}</p>
        <h1 className="type-title">{expense.vendor}</h1>
        <p className="mt-4 text-3xl">
          {expense.amount} {expense.currency}
        </p>
      </header>
      <dl className="grid grid-cols-2 gap-4">
        <dt>{invoicingPresentationCopy.incurred}</dt>
        <dd>{expense.incurredAt.slice(0, 10)}</dd>
        <dt>{invoicingPresentationCopy.submittedBy}</dt>
        <dd>{expense.submitter ?? invoicingPresentationCopy.notRecorded}</dd>
        <dt>{invoicingPresentationCopy.reviewStatus}</dt>
        <dd>{expense.status}</dd>
      </dl>
      <section>
        <h2 className="type-label">
          {invoicingPresentationCopy.businessPurpose}
        </h2>
        <p className="mt-3 whitespace-pre-wrap">
          {expense.description ?? invoicingPresentationCopy.notRecorded}
        </p>
      </section>
      {["DRAFT", "SUBMITTED"].includes(expense.status) && (
        <Link className="type-link" href={`/expenses/${expense.id}/edit`}>
          {invoicingPresentationCopy.editExpense}
        </Link>
      )}
    </Card>
  );
}

export function InvoicingExpensesContentBlock({
  expenses,
}: {
  expenses: ExpenseDTO[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof ExpensesToolbar>;
}) {
  return (
    <>
      <DashboardTable
        columns={[
          { key: "vendor", label: invoicingPresentationCopy.vendor },
          { key: "purpose", label: invoicingPresentationCopy.businessPurpose },
          { key: "amount", label: invoicingPresentationCopy.amount },
          { key: "date", label: invoicingPresentationCopy.incurred },
          { key: "submitter", label: invoicingPresentationCopy.submittedBy },
          { key: "review", label: invoicingPresentationCopy.reviewStatus },
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
    </>
  );
}

export function InvoicingInvoiceDetailPageBlock({
  invoice,
  children,
}: {
  invoice: InvoiceDTO;
  children?: ReactNode;
}) {
  return (
    <Card className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex flex-wrap justify-between gap-5 border-b border-border pb-6">
        <div>
          <p className="type-caption">{invoicingPresentationCopy.iNVOICE}</p>
          <h1 className="type-title">
            {invoicingPresentationCopy.numberPrefix}
            {invoice.number}
          </h1>
          <p>{invoice.status}</p>
        </div>
        <div>
          <p>
            {invoicingPresentationCopy.issued}
            {invoice.issuedAt?.slice(0, 10) ??
              invoicingPresentationCopy.notDated}
          </p>
          <p>
            {invoicingPresentationCopy.due}
            {invoice.dueAt?.slice(0, 10) ?? invoicingPresentationCopy.notDated}
          </p>
          {invoice.status === "DRAFT" && !invoice.approvedAt && (
            <Link className="type-link" href={`/invoices/${invoice.id}/edit`}>
              {invoicingPresentationCopy.editDraft}
            </Link>
          )}
        </div>
      </header>
      <section>
        <h2 className="type-label">{invoicingPresentationCopy.billTo}</h2>
        <p className="mt-2 text-xl">{invoice.customerName}</p>
        <p>{invoice.customerEmail}</p>
      </section>
      <DashboardTable
        columns={[
          { key: "description", label: invoicingPresentationCopy.description },
          { key: "quantity", label: invoicingPresentationCopy.quantity },
          { key: "price", label: invoicingPresentationCopy.unitPrice },
          { key: "tax", label: invoicingPresentationCopy.tax },
          { key: "total", label: invoicingPresentationCopy.lineTotal },
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
        <dt>{invoicingPresentationCopy.subtotal}</dt>
        <dd>{invoice.subtotal}</dd>
        <dt>{invoicingPresentationCopy.tax}</dt>
        <dd>{invoice.taxTotal}</dd>
        <dt className="type-title">{invoicingPresentationCopy.total}</dt>
        <dd className="type-title">
          {invoice.total} {invoice.currency}
        </dd>
      </dl>
      {children}
    </Card>
  );
}

export function InvoicingInvoicesContentBlock({
  invoices,
}: {
  invoices: InvoiceDTO[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof InvoicesToolbar>;
}) {
  return (
    <>
      <p>
        {invoicingPresentationCopy.trackCustomerInvoicesAndDueDatesShowingUpTo}
      </p>
      <DashboardTable
        columns={[
          { key: "number", label: invoicingPresentationCopy.invoice },
          { key: "customer", label: invoicingPresentationCopy.customer },
          { key: "total", label: invoicingPresentationCopy.amount },
          { key: "status", label: invoicingPresentationCopy.paymentStatus },
          { key: "due", label: invoicingPresentationCopy.dueDate },
        ]}
        rows={invoices.map((invoice) => ({
          id: invoice.id,
          href: `/invoices/${invoice.id}`,
          cells: {
            number: `#${invoice.number}`,
            customer: invoice.customerName,
            total: `${invoice.total} ${invoice.currency}`,
            status: invoice.status,
            due:
              invoice.dueAt?.slice(0, 10) ?? invoicingPresentationCopy.notSet,
          },
        }))}
        emptyLabel={invoicingUiCopy.noMatchingInvoices}
      />
    </>
  );
}

export function InvoicingExpensesToolbarBlock(
  props: ComponentProps<typeof InvoicingExpensesContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <ExpensesToolbar {...toolbarProps} /> : toolbarSlot;
}
export function InvoicingInvoicesToolbarBlock(
  props: ComponentProps<typeof InvoicingInvoicesContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <InvoicesToolbar {...toolbarProps} /> : toolbarSlot;
}
