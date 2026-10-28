// Why: the settings screen behind its loading state.
import { Suspense } from "react";

import { SettingsFeature } from "@/features/settings/settingsFeature";
import { SettingsSkeleton } from "@/features/settings/settingsSkeleton";

export function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsFeature />
    </Suspense>
  );
}
