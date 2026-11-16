"use client";

import { OnboardingProfileFormClient } from "@/features/onboarding/onboarding-profile-form.client";

/** Completion mode retains the existing identity-scoped profile/provisioning action. */
export function NewOnboardingProfileForm({
  displayName,
}: {
  displayName: string;
}) {
  return (
    <OnboardingProfileFormClient displayName={displayName} mode="complete" />
  );
}
