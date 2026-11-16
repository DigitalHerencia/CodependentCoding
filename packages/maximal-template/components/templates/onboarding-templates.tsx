import {
  OnboardingFormBlock,
  OnboardingLoadingBlock,
  OnboardingProfileCardBlock,
  OnboardingProfileHeadingBlock,
  OnboardingResultBlock,
  OnboardingStatusBlock,
  OnboardingSubmitBlock,
} from "@/components/blocks/onboarding-blocks";
import type {
  OnboardingFormTemplateProps,
  OnboardingProfileDTO,
} from "@/types/onboardingTypes";
import type { ReactNode } from "react";

/** Templates arrange owned block slots; RHF remains in the form feature. */
export function OnboardingProfileFormTemplate({
  mode,
  review,
  pending,
  onSubmit,
  field,
  reviewContent,
  error,
  saved,
}: OnboardingFormTemplateProps) {
  return (
    <OnboardingFormBlock onSubmit={onSubmit} pending={pending}>
      <OnboardingProfileHeadingBlock mode={mode} review={review} />
      {review ? reviewContent : field}
      <OnboardingResultBlock error={error} saved={saved} />
      <OnboardingSubmitBlock review={review} pending={pending} />
    </OnboardingFormBlock>
  );
}
export function OnboardingStatusTemplate({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return <OnboardingStatusBlock title={title} description={description} />;
}
export function OnboardingProfileTemplate({
  profile,
  form,
}: {
  profile: OnboardingProfileDTO;
  form: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <OnboardingProfileCardBlock profile={profile} showEditLink={false} />
      {form}
    </div>
  );
}
export function OnboardingLoadingTemplate() {
  return <OnboardingLoadingBlock />;
}
