import { Suspense } from "react";
import { InvoicingEditInvoiceFeature } from "@/features/invoicing/invoicingEditInvoiceFeature";
import { InvoicingEditInvoiceSkeleton } from "@/features/invoicing/invoicingEditInvoiceSkeleton";
/** Route composes its authorized feature inside the appropriate streaming fallback. */
export default async function Page({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  return (
    <Suspense fallback={<InvoicingEditInvoiceSkeleton />}>
      <InvoicingEditInvoiceFeature invoiceId={invoiceId} />
    </Suspense>
  );
}
