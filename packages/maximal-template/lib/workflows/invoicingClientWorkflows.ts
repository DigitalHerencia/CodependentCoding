import {
  approveInvoice,
  issueApprovedInvoice,
} from "@/lib/actions/invoicingActions";
import type { ExpenseDTO, InvoiceDTO } from "@/types/invoicingTypes";

export function selectExpensesWorkflow(expenses: ExpenseDTO[], query: string) {
  return expenses.filter((expense) =>
    `${expense.vendor} ${expense.description ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
}

export function selectInvoicesWorkflow(
  invoices: InvoiceDTO[],
  query: string,
  status: string,
) {
  return invoices.filter(
    (invoice) =>
      (!status || invoice.status === status) &&
      `${invoice.number} ${invoice.customerName}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
}

export function getInvoiceCommandsWorkflow(invoice: InvoiceDTO) {
  return {
    canUpdate: invoice.status === "DRAFT",
    updateInvoice: (input: Parameters<typeof approveInvoice>[0]) =>
      invoice.approvedAt ? issueApprovedInvoice(input) : approveInvoice(input),
  };
}
