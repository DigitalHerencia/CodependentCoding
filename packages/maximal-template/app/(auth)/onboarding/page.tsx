import { Suspense } from "react";

import { OnboardingFeature } from "@/features/onboarding/onboarding-feature";
import { OnboardingSkeleton } from "@/features/onboarding/onboarding-skeleton";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default async function Page() {
  if (!(await getIdentity())) redirectToSignIn();

  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <OnboardingFeature />
    </Suspense>
  );
}
