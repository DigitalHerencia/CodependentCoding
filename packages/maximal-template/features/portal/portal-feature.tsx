import { PortalHomeTemplate } from "@/components/templates/portal-templates";
import { loadPortalWorkflow } from "@/lib/workflows/portalWorkflows";

export async function PortalFeature() {
  const { documents } = await loadPortalWorkflow();
  return <PortalHomeTemplate documents={documents} />;
}
