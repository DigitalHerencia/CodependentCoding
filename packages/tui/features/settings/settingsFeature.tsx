// Why: loads the settings once and hands them to the keyboard companion.
import { use } from "react";

import { SettingsFeatureClient } from "@/features/settings/settingsFeature.client";
import { getSettings } from "@/lib/fetchers/settingsFetchers";

export function SettingsFeature() {
  return <SettingsFeatureClient settings={use(getSettings())} />;
}
