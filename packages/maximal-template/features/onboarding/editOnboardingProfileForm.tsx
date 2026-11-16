"use client";
import { OnboardingProfileFormClient } from "@/features/onboarding/onboarding-profile-form.client";

/** Editing uses the active-member own-profile action, never the completion action. */
export function EditOnboardingProfileForm({
  displayName,
}: {
  displayName: string;
}) {
  return <OnboardingProfileFormClient displayName={displayName} mode="edit" />;
}
