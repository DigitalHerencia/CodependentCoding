import { OnboardingProfileCardBlock } from "@/components/blocks/onboarding-blocks";
import { loadOwnOnboardingProfileWorkflow } from "@/lib/workflows/onboardingWorkflows";

/** Compact personal profile entry for settings today and the later user menu. */
export async function OnboardingProfileCardFeature() {
  const { profile } = await loadOwnOnboardingProfileWorkflow();
  return <OnboardingProfileCardBlock profile={profile} />;
}
