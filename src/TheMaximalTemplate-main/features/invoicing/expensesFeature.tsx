import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getExpenses } from "@/lib/fetchers/invoicingFetchers";
export async function ExpensesFeature() {
  const expenses = await getExpenses();
  return (
    <div className="space-y-6">
      <PageHeaderBlock eyebrow="Invoicing" title="Expenses" />
      <DataTableBlock
        columns={[
          { key: "vendor", label: "Vendor" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status" },
          { key: "date", label: "Incurred" },
          { key: "submitter", label: "Submitted by" },
        ]}
        rows={expenses.map((expense) => ({
          id: expense.id,
          cells: {
            vendor: expense.vendor,
            amount: `${expense.currency} ${expense.amount}`,
            status: expense.status,
            date: new Date(expense.incurredAt).toLocaleDateString(),
            submitter: expense.submitter,
          },
        }))}
      />
    </div>
  );
}
