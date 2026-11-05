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
    <AdminGateFeature>
      <OnboardingGateFeature>{children}</OnboardingGateFeature>
    </AdminGateFeature>
  );
}
