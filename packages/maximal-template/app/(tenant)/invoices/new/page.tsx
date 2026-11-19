import { Suspense } from "react";
import { InvoicingNewInvoiceFeature } from "@/features/invoicing/invoicingNewInvoiceFeature";
import { InvoicingNewInvoiceSkeleton } from "@/features/invoicing/invoicingNewInvoiceSkeleton";
/** Route composes its authorized feature inside the appropriate streaming fallback. */
export default async function Page() {
  return (
    <Suspense fallback={<InvoicingNewInvoiceSkeleton />}>
      <InvoicingNewInvoiceFeature />
    </Suspense>
  );
}
