import { Suspense, type ReactNode } from "react";

import { TenantLoadingTemplate } from "@/components/templates/tenant-templates";
import { TenantShell } from "@/components/shells/tenant-shell";
import { tenantCopy } from "@/content/tenant";
import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { PwaAccountMenu } from "@/features/pwa/pwa-account-menu.client";
import { OrganizationSwitcherFeature } from "@/features/settings/organization-switcher-feature";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";
import { loadTenantNavigationWorkflow } from "@/lib/workflows/tenantWorkflows";

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
async function SignedInTenant({
  children,
}: Readonly<{ children: ReactNode }>) {
  const identity = await getIdentity();
  if (!identity) redirectToSignIn();

  return (
    <OnboardingGateFeature>
      <TenantWorkspace>{children}</TenantWorkspace>
    </OnboardingGateFeature>
  );
}

/** The gate has passed; provide the one shared shell its current navigation. */
async function TenantWorkspace({
  children,
}: Readonly<{ children: ReactNode }>) {
  const navigation = await loadTenantNavigationWorkflow();
  return (
    <TenantShell
      navigation={navigation}
      accountMenu={<PwaAccountMenu />}
      organizationSwitcher={<OrganizationSwitcherFeature />}
    >
      {children}
    </TenantShell>
  );
}
