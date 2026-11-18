/** Account identity and membership presentation are independently owned slices. */
import { loadAuthAccountWorkflow } from "@/lib/workflows/authWorkflows";
import { AuthAccountFeatureClient } from "./authAccountFeatureClient";
import { AuthzOrganizationSwitcherFeature } from "@/features/authz/authzOrganizationSwitcherFeature";
/** Load only the caller's profile and provide the authorized organization feature as a slot. */
export async function AuthAccountFeature() {
  const { profile } = await loadAuthAccountWorkflow();
  return (
    <AuthAccountFeatureClient
      profile={profile}
      organizationSwitcher={<AuthzOrganizationSwitcherFeature />}
    />
  );
}
