import { Suspense } from "react";
import { OnboardingProfileFeature } from "@/features/onboarding/onboarding-profile-feature";
import { OnboardingSkeleton } from "@/features/onboarding/onboarding-skeleton";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

/** Own-profile editing retains Task 2's auth shell/error/loading boundaries. */
export default function Page() {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <SignedInProfile />
    </Suspense>
  );
}
async function SignedInProfile() {
  if (!(await getIdentity())) redirectToSignIn();
  return <OnboardingProfileFeature />;
}
