import { SharedIntegrationsTemplate } from "@/components/templates/shared-templates";
import { loadIntegrationsWorkflow } from "@/lib/workflows/settingsWorkflows";

export async function IntegrationsFeature() {
  const { integrations } = await loadIntegrationsWorkflow();
  return <SharedIntegrationsTemplate integrations={integrations} />;
}
