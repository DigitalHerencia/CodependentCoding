import { SettingsIntegrationsTemplate } from "@/components/templates/settings-templates";
import { loadIntegrationsWorkflow } from "@/lib/workflows/settingsWorkflows";

/** Load authorized configuration metadata entirely on the server. */
export async function SettingsIntegrationsFeature() {
  const view = await loadIntegrationsWorkflow();
  return <SettingsIntegrationsTemplate {...view} />;
}
