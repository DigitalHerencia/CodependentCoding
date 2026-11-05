import { Suspense } from "react";

import { MarketingAnalyticsFeature } from "@/features/marketing/marketing-analytics-feature";
import { MarketingAnalyticsSkeleton } from "@/features/marketing/marketing-analytics-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<MarketingAnalyticsSkeleton />}>
      <MarketingAnalyticsFeature />
    </Suspense>
  );
}
