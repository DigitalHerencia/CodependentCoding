import { Suspense } from "react";

import { ExpenseEditFeature } from "@/features/invoicing/expense-edit-feature";
import { ExpenseFormSkeleton } from "@/features/invoicing/expense-form-skeleton";

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
