import { OnboardingAccessFeature } from "@/features/onboarding/onboardingAccessFeature";
import { Suspense } from "react";

import { OnboardingFeature } from "@/features/onboarding/onboardingFeature";
import { OnboardingSkeleton } from "@/features/onboarding/onboardingSkeleton";

export default async function Page() {
  return (
    <OnboardingAccessFeature>
      <Suspense fallback={<OnboardingSkeleton />}>
        <OnboardingFeature />
      </Suspense>
    </OnboardingAccessFeature>
  );
}
