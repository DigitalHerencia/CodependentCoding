/** Layout contracts and composition for the owning application slice. */
import { AdminLoadingTemplate } from "@/components/templates/admin-shell-templates";
import { AdminShell } from "@/components/shells/admin-shell";
import { AuthenticatedUserMenuFeature } from "@/features/navigation/authenticated-user-menu-feature";
import { adminNavigationCopy } from "@/content/admin-navigation";
import { Suspense, type ReactNode } from "react";

import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import { AdminGateFeature } from "@/features/admin/admin-gate-feature";
import { getIdentity } from "@/lib/integrations/clerk/server";
import { redirectToSignIn } from "@/lib/utils/authRedirects";

// The session, membership and role reads stream behind the fallback, so the
// route still has a static shell (Cache Components).
export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense
      fallback={
        <AdminLoadingTemplate label={adminNavigationCopy.loadingLayout} />
      }
    >
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
        <AdminShell
          accountMenu={<AuthenticatedUserMenuFeature />}
          mobileAccountMenu={
            <AuthenticatedUserMenuFeature presentation="panel" />
          }
        >
          {children}
        </AdminShell>
      </AdminGateFeature>
    </OnboardingGateFeature>
  );
}
