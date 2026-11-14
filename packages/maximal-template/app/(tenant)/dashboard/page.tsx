import { Suspense } from "react";

import { DashboardFeature } from "@/features/dashboard/dashboard-feature";
import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton";

/** Authenticated tenant URL boundary; reads stream behind the feature fallback. */
export default function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardFeature />
    </Suspense>
  );
}
