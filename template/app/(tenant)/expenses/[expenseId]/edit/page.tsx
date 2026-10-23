import { Suspense } from "react";

import { ExpenseEditFeature } from "@/features/invoicing/expenseEditFeature";
import { ExpenseFormSkeleton } from "@/features/invoicing/expenseFormSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ expenseId: string }>;
}) {
  const { expenseId } = await params;
  return (
    <Suspense fallback={<ExpenseFormSkeleton />}>
      <ExpenseEditFeature expenseId={expenseId} />
    </Suspense>
  );
}
