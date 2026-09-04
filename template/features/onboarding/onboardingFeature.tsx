import { SharedOnboardingTemplate } from "@/components/templates/sharedOnboardingTemplate";
import { OnboardingFeatureClient } from "@/features/onboarding/onboardingFeature.client";
import { getOrganizationSettingsWorkflow } from "@/lib/workflows/organizationWorkflows";

export async function OnboardingFeature() {
  await getOrganizationSettingsWorkflow();
  return (
    <SharedOnboardingTemplate clientIsland={<OnboardingFeatureClient />} />
  );
}
