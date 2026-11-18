/** Authenticate before mandatory onboarding, then gate tenant administration. */
import { requireAdminIdentityWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminShellTemplate } from "@/components/templates/admin-templates";
import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { AuthenticatedUserMenuFeature } from "@/features/navigation/authenticated-user-menu-feature";
import { AdminGateFeature } from "./admin-gate-feature";
import type { AdminChildrenProps } from "@/types/adminTypes";
/** Keep provider identity and tenancy reads behind the route's Suspense boundary. */
export async function AdminLayoutFeature({ children }: AdminChildrenProps) {
  await requireAdminIdentityWorkflow();
  return (
    <OnboardingGateFeature>
      <AdminGateFeature>
        <AdminShellTemplate
          accountMenu={<AuthenticatedUserMenuFeature />}
          mobileAccountMenu={
            <AuthenticatedUserMenuFeature presentation="panel" />
          }
        >
          {children}
        </AdminShellTemplate>
      </AdminGateFeature>
    </OnboardingGateFeature>
  );
}
