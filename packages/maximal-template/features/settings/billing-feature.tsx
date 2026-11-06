import { BillingSettingsTemplate } from "@/components/templates/billing-templates";
import { loadBillingWorkflow } from "@/lib/workflows/settingsWorkflows";

export async function BillingFeature() {
  const { subscription } = await loadBillingWorkflow();
  return <BillingSettingsTemplate subscription={subscription} />;
}
