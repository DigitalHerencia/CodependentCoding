import { SettingsBillingTemplate } from "@/components/templates/settings-templates";
import { loadBillingWorkflow } from "@/lib/workflows/settingsWorkflows";

/** Compose the authorized billing record without invoking provider effects. */
export async function SettingsBillingFeature() {
  const view = await loadBillingWorkflow();
  return <SettingsBillingTemplate {...view} />;
}
