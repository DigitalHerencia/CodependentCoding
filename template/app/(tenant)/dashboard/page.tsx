import { Suspense } from "react";

import { DashboardFeature } from "@/features/dashboard/dashboard-feature";
import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardFeature />
    </Suspense>
  );
}
