/** All authenticated application surfaces render this identity-only onboarding gate. */
import type { AuthChildrenProps } from "@/types/authTypes";
import { loadOnboardingWorkflow } from "@/lib/workflows/onboardingWorkflows";
import { OnboardingNewForm } from "@/features/onboarding/onboardingNewForm";
/** Incomplete profiles see only the modal; protected children never render first. */
export async function OnboardingGateFeature({ children }: AuthChildrenProps) {
  const { profile } = await loadOnboardingWorkflow();
  if (!profile.profileCompletedAt)
    return <OnboardingNewForm profile={profile} />;
  return children;
}
