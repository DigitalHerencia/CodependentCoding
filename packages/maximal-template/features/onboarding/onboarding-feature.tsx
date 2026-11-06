import { SharedOnboardingTemplate } from "@/components/templates/shared-templates";
import { onboardingPresentationCopy } from "@/content/onboarding";
import {
  NewOnboardingProfileForm,
  WorkspaceApprovalCheck,
} from "@/features/onboarding/newOnboardingProfileForm";
import { loadOnboardingWorkflow } from "@/lib/workflows/onboardingWorkflows";

export async function OnboardingFeature() {
  const { state } = await loadOnboardingWorkflow();
  if (state.status === "profile")
    return <NewOnboardingProfileForm displayName={state.displayName} />;
  return (
    <SharedOnboardingTemplate
      title={
        state.status === "provisioning"
          ? onboardingPresentationCopy.preparingYourAccount
          : onboardingPresentationCopy.waitingForApproval
      }
      description={
        state.status === "provisioning"
          ? onboardingPresentationCopy.refreshThisPageInAMomentToContinue
          : onboardingPresentationCopy.yourProfileIsCompleteAWorkspaceAdministratorMustGrant
      }
    >
      {state.status === "pending" && <WorkspaceApprovalCheck />}
    </SharedOnboardingTemplate>
  );
}
