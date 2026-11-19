import {
  InvoicingCommandsBlock,
  InvoicingExpenseDetailBlock,
  InvoicingExpensesTableBlock,
  InvoicingFieldBlock,
  InvoicingFiltersBlock,
  InvoicingFormBlock,
  InvoicingHeadingBlock,
  InvoicingInvoiceDetailBlock,
  InvoicingInvoicesTableBlock,
  InvoicingLineBlock,
  InvoicingPaginationBlock,
  InvoicingSummaryBlock,
  InvoicingTotalsBlock,
  InvoicingUnavailableBlock,
} from "@/components/blocks/invoicing-blocks";
import type { ComponentProps } from "react";

type ListProps = Omit<ComponentProps<typeof InvoicingFiltersBlock>, "mode"> &
  Omit<ComponentProps<typeof InvoicingSummaryBlock>, "mode"> &
  Omit<ComponentProps<typeof InvoicingPaginationBlock>, "mode"> & {
    canCreate: boolean;
  };

/** Invoice page composition inside the existing tenant shell. */
export function InvoicingInvoicesTemplate({
  invoices,
  canCreate,
  ...props
}: ListProps & ComponentProps<typeof InvoicingInvoicesTableBlock>) {
  return (
    <div className="space-y-6">
      <InvoicingHeadingBlock mode="invoices" create={canCreate} />
      <InvoicingFiltersBlock mode="invoices" query={props.query} />
      <InvoicingSummaryBlock
        mode="invoices"
        summary={props.summary}
        query={props.query}
      />
      <InvoicingInvoicesTableBlock invoices={invoices} />
      <InvoicingPaginationBlock
        mode="invoices"
        query={props.query}
        pagination={props.pagination}
      />
    </div>
  );
}
/** Expense page composition retains the tenant navigation and responsive shell. */
export function InvoicingExpensesTemplate({
  expenses,
  canCreate,
  ...props
}: ListProps & ComponentProps<typeof InvoicingExpensesTableBlock>) {
  return (
    <div className="space-y-6">
      <InvoicingHeadingBlock mode="expenses" create={canCreate} />
      <InvoicingFiltersBlock mode="expenses" query={props.query} />
      <InvoicingSummaryBlock
        mode="expenses"
        summary={props.summary}
        query={props.query}
      />
      <InvoicingExpensesTableBlock expenses={expenses} />
      <InvoicingPaginationBlock
        mode="expenses"
        query={props.query}
        pagination={props.pagination}
      />
    </div>
  );
}
/** Authorized invoice detail presentation. */
export function InvoicingInvoiceDetailTemplate(
  props: ComponentProps<typeof InvoicingInvoiceDetailBlock>,
) {
  return <InvoicingInvoiceDetailBlock {...props} />;
}
/** Authorized expense detail presentation. */
export function InvoicingExpenseDetailTemplate(
  props: ComponentProps<typeof InvoicingExpenseDetailBlock>,
) {
  return <InvoicingExpenseDetailBlock {...props} />;
}

type FormProps = Omit<
  ComponentProps<typeof InvoicingFormBlock>,
  "mode" | "edit"
>;
/** New invoice route's sole page template. */
export function InvoicingNewInvoiceTemplate(props: FormProps) {
  return <InvoicingFormBlock {...props} mode="invoices" edit={false} />;
}
/** Edit invoice route's sole page template. */
export function InvoicingEditInvoiceTemplate(props: FormProps) {
  return <InvoicingFormBlock {...props} mode="invoices" edit />;
}
/** New expense route's sole page template. */
export function InvoicingNewExpenseTemplate(props: FormProps) {
  return <InvoicingFormBlock {...props} mode="expenses" edit={false} />;
}
/** Edit expense route's sole page template. */
export function InvoicingEditExpenseTemplate(props: FormProps) {
  return <InvoicingFormBlock {...props} mode="expenses" edit />;
}

/** Field presentation adapter keeps primitive and copy imports in blocks. */
export function InvoicingFieldTemplate(
  props: ComponentProps<typeof InvoicingFieldBlock>,
) {
  return <InvoicingFieldBlock {...props} />;
}
/** Line presentation adapter keeps field array operations in the owning RHF form. */
export function InvoicingLineTemplate(
  props: ComponentProps<typeof InvoicingLineBlock>,
) {
  return <InvoicingLineBlock {...props} />;
}
/** Preview uses already calculated decimal strings from the shared calculator. */
export function InvoicingPreviewTemplate(
  props: ComponentProps<typeof InvoicingTotalsBlock>,
) {
  return <InvoicingTotalsBlock {...props} preview />;
}
/** Command UI is orchestrated only by the invoice client island. */
export function InvoicingCommandsTemplate(
  props: ComponentProps<typeof InvoicingCommandsBlock>,
) {
  return <InvoicingCommandsBlock {...props} />;
}
/** Display a permission or lifecycle restriction at create/edit entry points. */
export function InvoicingUnavailableTemplate(
  props: ComponentProps<typeof InvoicingUnavailableBlock>,
) {
  return <InvoicingUnavailableBlock {...props} />;
}
