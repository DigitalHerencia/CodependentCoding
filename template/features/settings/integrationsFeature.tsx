import { getIntegrationStatuses } from "@/lib/workflows/organizationWorkflows";
import { SharedIntegrationsTemplate } from "@/components/templates/shared-templates";
export async function IntegrationsFeature() {
  return (
    <SharedIntegrationsTemplate integrations={await getIntegrationStatuses()} />
  );
}
