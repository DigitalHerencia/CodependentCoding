// Why: loads the template's presets once and hands them to the new-app companion.
import { use } from "react";

import { AppsNewFeatureClient } from "@/features/apps/appsNewFeature.client";
import { getModuleCatalog } from "@/lib/fetchers/modulesFetchers";

export function AppsNewFeature() {
  const { presets } = use(getModuleCatalog());
  return <AppsNewFeatureClient presets={presets} />;
}
