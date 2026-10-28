// Why: loads the module manifest once and hands it to the keyboard companion.
import { use } from "react";

import { ModulesFeatureClient } from "@/features/modules/modulesFeature.client";
import { getModuleCatalog } from "@/lib/fetchers/modulesFetchers";

export function ModulesFeature() {
  const { modules } = use(getModuleCatalog());
  return <ModulesFeatureClient modules={modules} />;
}
