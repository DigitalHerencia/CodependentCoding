import type { ReactNode } from "react";

import { OnboardingGateFeature } from "@/features/onboarding/onboardingGateFeature";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default async function TenantLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const identity = await getIdentity();
  if (!identity) redirectToSignIn();

  return <OnboardingGateFeature>{children}</OnboardingGateFeature>;
}
