import { Suspense } from "react";
import { InvoicingExpensesFeature } from "@/features/invoicing/invoicingExpensesFeature";
import { InvoicingExpensesSkeleton } from "@/features/invoicing/invoicingExpensesSkeleton";
/** Route composes its authorized feature inside the appropriate streaming fallback. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  return (
    <Suspense fallback={<InvoicingExpensesSkeleton />}>
      <InvoicingExpensesFeature query={query} />
    </Suspense>
  );
}
