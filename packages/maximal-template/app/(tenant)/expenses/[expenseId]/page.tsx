import { Suspense } from "react";
import { InvoicingExpenseDetailFeature } from "@/features/invoicing/invoicingExpenseDetailFeature";
import { InvoicingExpenseDetailSkeleton } from "@/features/invoicing/invoicingExpenseDetailSkeleton";
/** Route composes its authorized feature inside the appropriate streaming fallback. */
export default async function Page({
  params,
}: {
  params: Promise<{ expenseId: string }>;
}) {
  const { expenseId } = await params;
  return (
    <Suspense fallback={<InvoicingExpenseDetailSkeleton />}>
      <InvoicingExpenseDetailFeature expenseId={expenseId} />
    </Suspense>
  );
}
