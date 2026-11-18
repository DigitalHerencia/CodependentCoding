/** Authorized workspace orchestration after mandatory local profile completion. */
import { TenantShell } from "@/components/shells/tenant-shell";
import { AuthenticatedUserMenuFeature } from "@/features/navigation/authenticated-user-menu-feature";
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
    <TenantShell
      navigation={navigation}
      accountMenu={<AuthenticatedUserMenuFeature />}
      mobileAccountMenu={<AuthenticatedUserMenuFeature presentation="panel" />}
    >
      {children}
    </TenantShell>
  );
}
