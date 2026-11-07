import { PageLoadingTemplate } from "@/components/templates/shared-templates";
import { AdminShell } from "@/components/shells/admin-shell";
import { PwaAccountMenu } from "@/features/pwa/pwa-account-menu.client";
import { Suspense, type ReactNode } from "react";

import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { AdminGateFeature } from "@/features/admin/admin-gate-feature";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

// The session, membership and role reads stream behind the fallback, so the
// route still has a static shell (Cache Components).
export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense fallback={<PageLoadingTemplate label="Loading administration" />}>
      <SignedInAdmin>{children}</SignedInAdmin>
    </Suspense>
  );
}

async function SignedInAdmin({ children }: Readonly<{ children: ReactNode }>) {
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
