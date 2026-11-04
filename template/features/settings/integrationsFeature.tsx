import { notFound } from "next/navigation";
import { getIntegrationStatuses } from "@/lib/workflows/organizationWorkflows";
import { SharedIntegrationsTemplate } from "@/components/templates/shared-templates";
export async function IntegrationsFeature() {
  const integrations = await getIntegrationStatuses();
  if (!integrations) notFound();
  return <SharedIntegrationsTemplate integrations={integrations} />;
}
