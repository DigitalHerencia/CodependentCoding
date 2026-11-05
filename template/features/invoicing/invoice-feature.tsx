import { InvoiceFeatureClient } from "./invoice-feature.client";
import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/fetchers/invoicingFetchers";
import { InvoicingInvoiceDetailTemplate } from "@/components/templates/invoicing-templates";
export async function InvoiceFeature({ invoiceId }: { invoiceId: string }) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) notFound();
  return (
    <InvoicingInvoiceDetailTemplate invoice={invoice}>
      <InvoiceFeatureClient key={invoice.version} invoice={invoice} />
    </InvoicingInvoiceDetailTemplate>
  );
}
