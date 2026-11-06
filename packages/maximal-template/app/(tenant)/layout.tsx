import { TenantFooter } from "@/components/nav/tenant-footer";
import { TenantShell } from "@/components/shells/tenant-shell";
import { PwaAccountMenu } from "@/features/pwa/pwa-account-menu.client";
import { OrganizationSwitcherFeature } from "@/features/settings/organization-switcher-feature";
import type { ReactNode } from "react";

import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default async function TenantLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const identity = await getIdentity();
  if (!identity) redirectToSignIn();

  return (
    <OnboardingGateFeature>
      <TenantShell
        accountMenu={<PwaAccountMenu />}
        footer={<TenantFooter />}
        organizationSwitcher={<OrganizationSwitcherFeature />}
      >
        {children}
      </TenantShell>
    </OnboardingGateFeature>
  );
}
