import { SharedProfileSettingsTemplate } from "@/components/templates/shared-templates";
import { loadProfileWorkflow } from "@/lib/workflows/settingsWorkflows";
import { OnboardingProfileCardFeature } from "@/features/onboarding/onboarding-profile-card-feature";
import { EditOrganizationSettingsForm } from "./editOrganizationSettingsForm";

export async function ProfileFeature() {
  const { organization } = await loadProfileWorkflow();
  return (
    <>
      <OnboardingProfileCardFeature />
      <SharedProfileSettingsTemplate organization={organization}>
        <EditOrganizationSettingsForm organization={organization} />
      </SharedProfileSettingsTemplate>
    </>
  );
}
