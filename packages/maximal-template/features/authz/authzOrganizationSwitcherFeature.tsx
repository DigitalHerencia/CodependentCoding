/** Server feature that orchestrates the organization switcher. */
import { AuthzOrganizationSwitcherFeatureClient } from "@/features/authz/authzOrganizationSwitcherFeatureClient";
import { loadOrganizationSwitcherWorkflow } from "@/lib/workflows/authzWorkflows";

/** The tenant shell's organization picker; shown only to users with more than one organization. */
export async function AuthzOrganizationSwitcherFeature() {
  const { switcher } = await loadOrganizationSwitcherWorkflow();
  if (switcher.organizations.length < 2) return null;
  return <AuthzOrganizationSwitcherFeatureClient {...switcher} />;
}
