import { redirect } from "next/navigation";
import {
  OnboardingFeatureClient,
  WorkspaceApprovalCheck,
} from "@/features/onboarding/onboardingFeature.client";
import { getOnboardingState } from "@/lib/fetchers/onboardingFetchers";

export async function OnboardingFeature() {
  const state = await getOnboardingState();
  if (state.status === "active") redirect("/dashboard");
  if (state.status === "profile") {
    return <OnboardingFeatureClient displayName={state.displayName} />;
  }

  return (
    <section className="mx-auto max-w-lg space-y-3">
      <h1 className="text-2xl font-semibold">
        {state.status === "provisioning"
          ? "Preparing your account"
          : "Waiting for approval"}
      </h1>
      <p className="text-muted-foreground">
        {state.status === "provisioning"
          ? "Refresh this page in a moment to continue."
          : "Your profile is complete. A workspace administrator must grant you access. Check your access after the administrator approves it."}
      </p>
      {state.status === "pending" && <WorkspaceApprovalCheck />}
    </section>
  );
}
