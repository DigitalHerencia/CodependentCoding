import type { ReactNode } from "react";

import { OnboardingGateFeature } from "@/features/onboarding/onboardingGateFeature";
import { AdminGateFeature } from "@/features/admin/adminGateFeature";
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
