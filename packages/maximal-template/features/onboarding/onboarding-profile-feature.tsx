import { OnboardingProfileTemplate } from "@/components/templates/onboarding-templates";
import { EditOnboardingProfileForm } from "@/features/onboarding/editOnboardingProfileForm";
import { loadOwnOnboardingProfileWorkflow } from "@/lib/workflows/onboardingWorkflows";

/** The authenticated read enforces completion and an ACTIVE organization membership. */
export async function OnboardingProfileFeature() {
  const { profile } = await loadOwnOnboardingProfileWorkflow();
  return (
    <OnboardingProfileTemplate
      profile={profile}
      form={<EditOnboardingProfileForm displayName={profile.displayName} />}
    />
  );
}
