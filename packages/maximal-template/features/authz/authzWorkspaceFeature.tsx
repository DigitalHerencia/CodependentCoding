/** Authorized workspace orchestration after mandatory local profile completion. */
import { TenantShellTemplate } from "@/components/templates/tenant-templates";
import { AuthAccountFeature } from "@/features/auth/authAccountFeature";
import { loadTenantNavigationWorkflow } from "@/lib/workflows/tenantWorkflows";
import { recoverAuthzAccessWorkflow } from "@/lib/workflows/authzWorkflows";
import type { AuthChildrenProps } from "@/types/authTypes";

/** Retry navigation once after authorized provisioning repairs webhook delivery lag. */
export async function AuthzWorkspaceFeature({ children }: AuthChildrenProps) {
  const navigation = await loadTenantNavigationWorkflow().catch(
    async (error: unknown) => {
      await recoverAuthzAccessWorkflow(error);
      return loadTenantNavigationWorkflow();
    },
  );
  return (
    <TenantShellTemplate
      navigation={navigation}
      accountMenu={<AuthAccountFeature />}
    >
      {children}
    </TenantShellTemplate>
  );
}
