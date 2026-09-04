import { Suspense } from "react";

import { SupportAnalyticsFeature } from "@/features/support/supportAnalyticsFeature";
import { SupportAnalyticsSkeleton } from "@/features/support/supportAnalyticsSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<SupportAnalyticsSkeleton />}>
      <SupportAnalyticsFeature />
    </Suspense>
  );
}
