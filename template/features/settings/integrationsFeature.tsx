import { getIntegrationStatuses } from "@/lib/workflows/organizationWorkflows";
import { SharedIntegrationsTemplate } from "@/components/templates/sharedIntegrationsTemplate";
export async function IntegrationsFeature() {
  return (
    <SharedIntegrationsTemplate integrations={await getIntegrationStatuses()} />
  );
}
