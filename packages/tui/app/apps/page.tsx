// Why: the apps screen behind its loading state.
import { Suspense } from "react";

import { AppsFeature } from "@/features/apps/appsFeature";
import { AppsSkeleton } from "@/features/apps/appsSkeleton";

export function AppsPage() {
  return (
    <Suspense fallback={<AppsSkeleton />}>
      <AppsFeature />
    </Suspense>
  );
}
