import { Suspense } from "react";

import { OnboardingFeature } from "@/features/onboarding/onboarding-feature";
import { OnboardingSkeleton } from "@/features/onboarding/onboarding-skeleton";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default function Page() {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <SignedInOnboarding />
    </Suspense>
  );
}

async function SignedInOnboarding() {
  if (!(await getIdentity())) redirectToSignIn();
  return <OnboardingFeature />;
}
