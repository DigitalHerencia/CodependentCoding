/** Authentication precedes mandatory profile completion and active-workspace authorization. */
import { requireTenantIdentityWorkflow } from "@/lib/workflows/tenantWorkflows";
import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { AuthzWorkspaceFeature } from "@/features/authz/authzWorkspaceFeature";
import type { TenantChildrenProps } from "@/types/tenantTypes";
/** All identity and membership work streams inside the route group's Suspense boundary. */
export async function TenantLayoutFeature({ children }: TenantChildrenProps) {
  await requireTenantIdentityWorkflow();
  return (
    <OnboardingGateFeature>
      <AuthzWorkspaceFeature>{children}</AuthzWorkspaceFeature>
    </OnboardingGateFeature>
  );
}
