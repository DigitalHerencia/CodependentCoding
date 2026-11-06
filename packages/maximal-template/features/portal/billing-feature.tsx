import { PortalBillingTemplate } from "@/components/templates/portal-templates";
import { loadBillingWorkflow } from "@/lib/workflows/portalWorkflows";

export async function BillingFeature() {
  const { billing } = await loadBillingWorkflow();
  return <PortalBillingTemplate billing={billing} />;
}
