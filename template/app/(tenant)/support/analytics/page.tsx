import { Suspense } from "react";

import { SupportAnalyticsFeature } from "@/features/support/support-analytics-feature";
import { SupportAnalyticsSkeleton } from "@/features/support/support-analytics-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<SupportAnalyticsSkeleton />}>
      <SupportAnalyticsFeature />
    </Suspense>
  );
}
