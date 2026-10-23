import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/fetchers/invoicingFetchers";
import { InvoiceNewForm } from "./invoiceNewForm";
export async function InvoiceEditFeature({ invoiceId }: { invoiceId: string }) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) notFound();
  return <InvoiceNewForm invoice={invoice} />;
}
