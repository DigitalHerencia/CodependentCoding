import type { ComponentProps, ReactNode } from "react";

export type OnboardingProfileDTO = {
  displayName: string;
  profileCompletedAt: string | null;
};
export type OnboardingProfileMode = "complete" | "edit";
export type OnboardingProfileFormProps = {
  displayName: string;
  mode: OnboardingProfileMode;
};
export type OnboardingFormTemplateProps = {
  mode: OnboardingProfileMode;
  review: boolean;
  pending: boolean;
  onSubmit: ComponentProps<"form">["onSubmit"];
  field: ReactNode;
  reviewContent: ReactNode;
  error?: string | undefined;
  saved: boolean;
};
export type OnboardingNameFieldProps = ComponentProps<"input"> & {
  error?: string | undefined;
};
