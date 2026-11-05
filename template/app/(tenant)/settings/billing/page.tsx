import { Suspense } from "react";

import { BillingFeature } from "@/features/settings/billing-feature";
import { BillingSkeleton } from "@/features/settings/billing-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingFeature />
    </Suspense>
  );
}
