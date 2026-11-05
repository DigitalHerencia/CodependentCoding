import { AdminShell } from "@/components/shells/admin-shell";
import { PwaAccountMenu } from "@/features/pwa/pwa-account-menu.client";
import type { ReactNode } from "react";

import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { AdminGateFeature } from "@/features/admin/admin-gate-feature";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const identity = await getIdentity();
  if (!identity) redirectToSignIn();

  return (
    <OnboardingGateFeature>
      <AdminGateFeature>
        <AdminShell accountMenu={<PwaAccountMenu />}>{children}</AdminShell>
      </AdminGateFeature>
    </OnboardingGateFeature>
  );
}
