/** Layout contracts and composition for the owning application slice. */
import { Suspense, type ReactNode } from "react";

import { TenantLoadingTemplate } from "@/components/templates/tenant-templates";
import { tenantCopy } from "@/content/tenant";
import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { getIdentity } from "@/lib/integrations/clerk/server";
import { redirectToSignIn } from "@/lib/utils/authRedirects";
import { AuthzWorkspaceFeature } from "@/features/authz/authzWorkspaceFeature";

/** Authenticated tenant frame; membership and navigation reads stream behind Suspense. */
export default function TenantLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense
      fallback={<TenantLoadingTemplate label={tenantCopy.loadingWorkspace} />}
    >
      <SignedInTenant>{children}</SignedInTenant>
    </Suspense>
  );
}

/** Authenticate before evaluating the tenant onboarding gate. */
async function SignedInTenant({ children }: Readonly<{ children: ReactNode }>) {
  const identity = await getIdentity();
  if (!identity) redirectToSignIn();

  return (
    <OnboardingGateFeature>
      <AuthzWorkspaceFeature>{children}</AuthzWorkspaceFeature>
    </OnboardingGateFeature>
  );
}
