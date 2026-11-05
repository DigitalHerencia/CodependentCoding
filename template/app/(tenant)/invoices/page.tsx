import { Suspense } from "react";

import { InvoicesFeature } from "@/features/invoicing/invoices-feature";
import { InvoicesSkeleton } from "@/features/invoicing/invoices-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<InvoicesSkeleton />}>
      <InvoicesFeature />
    </Suspense>
  );
}
