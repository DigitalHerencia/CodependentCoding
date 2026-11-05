import { Suspense } from "react";

import { ExpenseFeature } from "@/features/invoicing/expense-feature";
import { ExpenseSkeleton } from "@/features/invoicing/expense-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ expenseId: string }>;
}) {
  const { expenseId } = await params;
  return (
    <Suspense fallback={<ExpenseSkeleton />}>
      <ExpenseFeature expenseId={expenseId} />
    </Suspense>
  );
}
