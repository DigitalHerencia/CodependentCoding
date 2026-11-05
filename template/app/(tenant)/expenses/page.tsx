import { Suspense } from "react";

import { ExpensesFeature } from "@/features/invoicing/expenses-feature";
import { ExpensesSkeleton } from "@/features/invoicing/expenses-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<ExpensesSkeleton />}>
      <ExpensesFeature />
    </Suspense>
  );
}
