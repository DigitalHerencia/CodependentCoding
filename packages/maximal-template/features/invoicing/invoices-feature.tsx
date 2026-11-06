import { loadInvoicesWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { InvoicesFeatureClient } from "./invoices-feature.client";

export async function InvoicesFeature() {
  const { invoices } = await loadInvoicesWorkflow();
  return <InvoicesFeatureClient invoices={invoices} />;
}
