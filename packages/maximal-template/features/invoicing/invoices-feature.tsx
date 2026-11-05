import { getInvoices } from "@/lib/fetchers/invoicingFetchers";
import { InvoicesFeatureClient } from "./invoices-feature.client";
export async function InvoicesFeature() {
  return <InvoicesFeatureClient invoices={await getInvoices(100)} />;
}
