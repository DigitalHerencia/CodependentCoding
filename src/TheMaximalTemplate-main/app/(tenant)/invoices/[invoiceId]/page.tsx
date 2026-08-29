import { InvoiceFeature } from "@/features/invoicing/invoiceFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default async function Page({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  return <InvoiceFeature invoiceId={invoiceId} />;
}
