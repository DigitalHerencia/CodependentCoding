import { Suspense } from "react";

import { CrmAnalyticsFeature } from "@/features/crm/crmAnalyticsFeature";
import { CrmAnalyticsSkeleton } from "@/features/crm/crmSkeletons";

/** Declare or implement the CRM-specific contract named Page. */
export default async function Page() {
  return (
    <Suspense fallback={<CrmAnalyticsSkeleton />}>
      <CrmAnalyticsFeature />
    </Suspense>
  );
}
