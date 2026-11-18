/** Authenticate before mandatory onboarding, then gate tenant administration. */
import { requireAdminIdentityWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminShellTemplate } from "@/components/templates/admin-templates";
import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { AuthAccountFeature } from "@/features/auth/authAccountFeature";
import { AdminGateFeature } from "./adminGateFeature";
import type { AdminChildrenProps } from "@/types/adminTypes";
/** Keep provider identity and tenancy reads behind the route's Suspense boundary. */
export async function AdminLayoutFeature({ children }: AdminChildrenProps) {
  await requireAdminIdentityWorkflow();
  return (
    <OnboardingGateFeature>
      <AdminGateFeature>
        <AdminShellTemplate accountMenu={<AuthAccountFeature />}>
          {children}
        </AdminShellTemplate>
      </AdminGateFeature>
    </OnboardingGateFeature>
  );
}
