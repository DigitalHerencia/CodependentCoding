import {
  DataTableBlock,
  EmptyStateBlock,
  PageHeaderBlock,
  RecordDetailBlock,
} from "@/components/blocks/application-sections";
import { getInvoice } from "@/lib/fetchers/invoicingFetchers";
export async function InvoiceFeature({ invoiceId }: { invoiceId: string }) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice)
    return (
      <EmptyStateBlock
        title="Invoice not found"
        description="No invoice is visible with this identifier."
      />
    );
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow={`Invoice #${invoice.number}`}
        title={invoice.customerName}
      />
      <RecordDetailBlock
        title="Invoice totals"
        status={invoice.status}
        items={[
          {
            label: "Subtotal",
            value: `${invoice.currency} ${invoice.subtotal}`,
          },
          { label: "Tax", value: `${invoice.currency} ${invoice.taxTotal}` },
          { label: "Total", value: `${invoice.currency} ${invoice.total}` },
          {
            label: "Issued",
            value: invoice.issuedAt
              ? new Date(invoice.issuedAt).toLocaleDateString()
              : "—",
          },
          {
            label: "Due",
            value: invoice.dueAt
              ? new Date(invoice.dueAt).toLocaleDateString()
              : "—",
          },
        ]}
      />
      <DataTableBlock
        columns={[
          { key: "description", label: "Line" },
          { key: "quantity", label: "Quantity" },
          { key: "price", label: "Unit price" },
          { key: "total", label: "Total" },
        ]}
        rows={invoice.lines.map((line) => ({
          id: line.id,
          cells: {
            description: line.description,
            quantity: line.quantity,
            price: line.unitPrice,
            total: line.lineTotal,
          },
        }))}
      />
    </div>
  );
}
