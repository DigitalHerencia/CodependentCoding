import { Suspense } from "react";
import { InvoicingInvoiceDetailFeature } from "@/features/invoicing/invoicingInvoiceDetailFeature";
import { InvoicingInvoiceDetailSkeleton } from "@/features/invoicing/invoicingInvoiceDetailSkeleton";
/** Route composes its authorized feature inside the appropriate streaming fallback. */
export default async function Page({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  return (
    <Suspense fallback={<InvoicingInvoiceDetailSkeleton />}>
      <InvoicingInvoiceDetailFeature invoiceId={invoiceId} />
    </Suspense>
  );
}
