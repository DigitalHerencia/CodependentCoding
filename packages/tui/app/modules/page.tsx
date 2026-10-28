// Why: the modules screen behind its loading state.
import { Suspense } from "react";

import { ModulesFeature } from "@/features/modules/modulesFeature";
import { ModulesSkeleton } from "@/features/modules/modulesSkeleton";

export function ModulesPage() {
  return (
    <Suspense fallback={<ModulesSkeleton />}>
      <ModulesFeature />
    </Suspense>
  );
}
