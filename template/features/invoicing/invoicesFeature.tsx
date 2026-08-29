import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getInvoices } from "@/lib/fetchers/invoicingFetchers";
export async function InvoicesFeature() {
  const invoices = await getInvoices();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Invoicing"
        title="Invoices"
        action={{ label: "New invoice", href: "/invoices/new" }}
      />
      <DataTableBlock
        columns={[
          { key: "number", label: "Invoice" },
          { key: "customer", label: "Customer" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status" },
          { key: "due", label: "Due" },
        ]}
        rows={invoices.map((invoice) => ({
          id: invoice.id,
          href: `/invoices/${invoice.id}`,
          cells: {
            number: `#${invoice.number}`,
            customer: invoice.customerName,
            total: `${invoice.currency} ${invoice.total}`,
            status: invoice.status,
            due: invoice.dueAt
              ? new Date(invoice.dueAt).toLocaleDateString()
              : null,
          },
        }))}
      />
    </div>
  );
}
