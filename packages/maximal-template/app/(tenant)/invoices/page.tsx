import { Suspense } from "react";
import { InvoicingInvoicesFeature } from "@/features/invoicing/invoicingInvoicesFeature";
import { InvoicingInvoicesSkeleton } from "@/features/invoicing/invoicingInvoicesSkeleton";
/** Route composes its authorized feature inside the appropriate streaming fallback. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  return (
    <Suspense fallback={<InvoicingInvoicesSkeleton />}>
      <InvoicingInvoicesFeature query={query} />
    </Suspense>
  );
}
