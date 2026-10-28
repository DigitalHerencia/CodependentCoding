// Why: loads the remembered apps once and hands them to the keyboard companion.
import { use } from "react";

import { AppsFeatureClient } from "@/features/apps/appsFeature.client";
import { getGeneratedApps } from "@/lib/fetchers/appsFetchers";

export function AppsFeature() {
  return <AppsFeatureClient apps={use(getGeneratedApps())} />;
}
