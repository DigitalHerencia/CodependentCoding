/** Server feature that orchestrates the organization switcher. */
import { AuthzOrganizationSwitcherFeatureClient } from "@/features/authz/authzOrganizationSwitcherFeatureClient";
import { loadOrganizationSwitcherWorkflow } from "@/lib/workflows/authzWorkflows";

/** The tenant shell's organization picker; includes the current organization even when switching is unavailable. */
export async function AuthzOrganizationSwitcherFeature() {
  const { switcher, role } = await loadOrganizationSwitcherWorkflow();
  return <AuthzOrganizationSwitcherFeatureClient {...switcher} role={role} />;
}
