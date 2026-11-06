import { OrganizationSwitcherFeatureClient } from "@/features/settings/organization-switcher-feature.client";
import { loadOrganizationSwitcherWorkflow } from "@/lib/workflows/settingsWorkflows";

/** The tenant shell's organization picker; shown only to users with more than one organization. */
export async function OrganizationSwitcherFeature() {
  const { switcher } = await loadOrganizationSwitcherWorkflow();
  if (switcher.organizations.length < 2) return null;
  return <OrganizationSwitcherFeatureClient {...switcher} />;
}
