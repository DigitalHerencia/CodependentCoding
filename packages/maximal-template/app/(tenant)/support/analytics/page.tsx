import { SupportAnalyticsFeature } from "@/features/support/supportAnalyticsFeature";
import { SupportAnalyticsSkeleton } from "@/features/support/supportAnalyticsSkeleton";
import { Suspense } from "react";

/** Mount the analytics feature in the tenant shell. */
export default function Page() {
  return (
    <Suspense fallback={<SupportAnalyticsSkeleton />}>
      <SupportAnalyticsFeature />
    </Suspense>
  );
}
