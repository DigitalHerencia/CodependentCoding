import { Suspense } from "react";
import { InvoicingEditExpenseFeature } from "@/features/invoicing/invoicingEditExpenseFeature";
import { InvoicingEditExpenseSkeleton } from "@/features/invoicing/invoicingEditExpenseSkeleton";
/** Route composes its authorized feature inside the appropriate streaming fallback. */
export default async function Page({
  params,
}: {
  params: Promise<{ expenseId: string }>;
}) {
  const { expenseId } = await params;
  return (
    <Suspense fallback={<InvoicingEditExpenseSkeleton />}>
      <InvoicingEditExpenseFeature expenseId={expenseId} />
    </Suspense>
  );
}
