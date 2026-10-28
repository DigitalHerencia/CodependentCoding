// Why: the new-app screen behind its loading state.
import { Suspense } from "react";

import { AppsNewFeature } from "@/features/apps/appsNewFeature";
import { AppsNewSkeleton } from "@/features/apps/appsNewSkeleton";

export function NewAppPage() {
  return (
    <Suspense fallback={<AppsNewSkeleton />}>
      <AppsNewFeature />
    </Suspense>
  );
}
