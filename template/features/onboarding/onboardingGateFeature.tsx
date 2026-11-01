import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { TenantShell } from "@/components/shells/tenant-shell";
import { OrganizationSwitcherFeature } from "@/features/settings/organizationSwitcherFeature";
import { getOnboardingState } from "@/lib/fetchers/onboardingFetchers";

// Members who have not finished onboarding never reach the tenant shell.
export async function OnboardingGateFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  if (!(await getOnboardingState()).completed) redirect("/onboarding");

  return (
    <TenantShell organizationSwitcher={<OrganizationSwitcherFeature />}>
      {children}
    </TenantShell>
  );
}
