/** Integrations feature contracts and composition for the owning application slice. */
import { SharedIntegrationsTemplate } from "@/components/templates/shared-templates";
import { loadIntegrationsWorkflow } from "@/lib/workflows/authzWorkflows";

export async function IntegrationsFeature() {
  const { integrations } = await loadIntegrationsWorkflow();
  return <SharedIntegrationsTemplate integrations={integrations} />;
}
