import { InvoiceEditFeature } from "@/features/invoicing/invoiceEditFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  return <InvoiceEditFeature invoiceId={invoiceId} />;
}
