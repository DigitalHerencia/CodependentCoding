import { OnboardingAccessFeature } from "@/features/onboarding/onboarding-access-feature";
import { Suspense } from "react";

import { OnboardingFeature } from "@/features/onboarding/onboarding-feature";
import { OnboardingSkeleton } from "@/features/onboarding/onboarding-skeleton";

export default async function Page() {
  return (
    <OnboardingAccessFeature>
      <Suspense fallback={<OnboardingSkeleton />}>
        <OnboardingFeature />
      </Suspense>
    </OnboardingAccessFeature>
  );
}
