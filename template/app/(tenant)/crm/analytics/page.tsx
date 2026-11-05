import { Suspense } from "react";

import { CrmAnalyticsFeature } from "@/features/crm/crm-analytics-feature";
import { CrmAnalyticsSkeleton } from "@/features/crm/crm-analytics-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CrmAnalyticsSkeleton />}>
      <CrmAnalyticsFeature />
    </Suspense>
  );
}
