import { Suspense } from "react";
import { InvoicingNewExpenseFeature } from "@/features/invoicing/invoicingNewExpenseFeature";
import { InvoicingNewExpenseSkeleton } from "@/features/invoicing/invoicingNewExpenseSkeleton";
/** Route composes its authorized feature inside the appropriate streaming fallback. */
export default async function Page() {
  return (
    <Suspense fallback={<InvoicingNewExpenseSkeleton />}>
      <InvoicingNewExpenseFeature />
    </Suspense>
  );
}
