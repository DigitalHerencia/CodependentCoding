import { Suspense } from "react";

import { MarketingAnalyticsFeature } from "@/features/marketing/marketingAnalyticsFeature";
import { MarketingAnalyticsSkeleton } from "@/features/marketing/marketingAnalyticsSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<MarketingAnalyticsSkeleton />}>
      <MarketingAnalyticsFeature />
    </Suspense>
  );
}
