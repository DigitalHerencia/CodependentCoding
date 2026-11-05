import { SharedOnboardingTemplate } from "@/components/templates/shared-templates";
import { onboardingPresentationCopy } from "@/content/onboarding";
import { redirect } from "next/navigation";
import {
  OnboardingFeatureClient,
  WorkspaceApprovalCheck,
} from "@/features/onboarding/onboarding-form.client";
import { getOnboardingState } from "@/lib/fetchers/onboardingFetchers";

export async function OnboardingFeature() {
  const state = await getOnboardingState();
  if (state.status === "active") redirect("/dashboard");
  if (state.status === "profile") {
    return <OnboardingFeatureClient displayName={state.displayName} />;
  }

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
