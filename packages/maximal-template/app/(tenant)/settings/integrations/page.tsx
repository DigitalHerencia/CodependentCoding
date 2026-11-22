import { Suspense } from "react";
import { SettingsIntegrationsFeature } from "@/features/settings/settingsIntegrationsFeature";
import { SettingsIntegrationsSkeleton } from "@/features/settings/settingsIntegrationsSkeleton";

/** Preserve the integrations route with a route-specific pending boundary. */
export default function Page() {
  return (
    <Suspense fallback={<SettingsIntegrationsSkeleton />}>
      <SettingsIntegrationsFeature />
    </Suspense>
  );
}
