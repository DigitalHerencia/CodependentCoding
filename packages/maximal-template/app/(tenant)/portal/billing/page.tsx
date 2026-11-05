import { Suspense } from "react";

import { BillingFeature } from "@/features/portal/billing-feature";
import { BillingSkeleton } from "@/features/portal/billing-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingFeature />
    </Suspense>
  );
}
