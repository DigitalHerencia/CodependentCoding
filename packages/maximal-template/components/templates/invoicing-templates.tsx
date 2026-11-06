import { InvoiceControlsBlock } from "@/components/blocks/invoicing-blocks";
import {
  InvoicingExpenseDetailPageBlock,
  InvoicingExpensesContentBlock,
  InvoicingExpensesToolbarBlock,
  InvoicingInvoiceDetailPageBlock,
  InvoicingInvoicesContentBlock,
  InvoicingInvoicesToolbarBlock,
} from "@/components/blocks/invoicing-page-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { invoicingPresentationCopy } from "@/content/invoicing";
import type { ComponentProps } from "react";

export function InvoicingExpenseDetailTemplate(
  props: ComponentProps<typeof InvoicingExpenseDetailPageBlock>,
) {
  return <InvoicingExpenseDetailPageBlock {...props} />;
}
export function InvoicingExpensesTemplate(
  props: ComponentProps<typeof InvoicingExpensesContentBlock>,
) {
  return (
    <DashboardLayout
      title={invoicingPresentationCopy.expenseLedger}
      nav={[]}
      toolbar={<InvoicingExpensesToolbarBlock {...props} />}
    >
      <InvoicingExpensesContentBlock {...props} />
    </DashboardLayout>
  );
}
export function InvoicingInvoiceDetailTemplate(
  props: ComponentProps<typeof InvoicingInvoiceDetailPageBlock>,
) {
  return <InvoicingInvoiceDetailPageBlock {...props} />;
}
export function InvoicingInvoicesTemplate(
  props: ComponentProps<typeof InvoicingInvoicesContentBlock>,
) {
  return (
    <DashboardLayout
      title={invoicingPresentationCopy.accountsReceivable}
      nav={[]}
      toolbar={<InvoicingInvoicesToolbarBlock {...props} />}
    >
      <InvoicingInvoicesContentBlock {...props} />
    </DashboardLayout>
  );
}

export function InvoiceControlsTemplate(
  props: ComponentProps<typeof InvoiceControlsBlock>,
) {
  return <InvoiceControlsBlock {...props} />;
}
