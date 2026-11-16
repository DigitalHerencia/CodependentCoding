import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  onboardingPresentationCopy,
  onboardingRemainingCopy,
  onboardingStepCopy,
  onboardingProfileCopy,
} from "@/content/onboarding";
import type {
  OnboardingNameFieldProps,
  OnboardingProfileDTO,
  OnboardingProfileMode,
} from "@/types/onboardingTypes";
import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

/** Adapt the existing BoldKit profile/review presentation without demo persistence. */
export function OnboardingProfileHeadingBlock({
  mode,
  review,
}: {
  mode: OnboardingProfileMode;
  review: boolean;
}) {
  return (
    <>
      <h1 className="type-title">
        {mode === "edit"
          ? onboardingProfileCopy.editTitle
          : onboardingPresentationCopy.completeYourProfile}
      </h1>
      <ol aria-label={onboardingStepCopy.steps} className="flex gap-4">
        <li aria-current={!review ? "step" : undefined}>
          {onboardingStepCopy.profile}
        </li>
        <li aria-current={review ? "step" : undefined}>
          {onboardingStepCopy.review}
        </li>
      </ol>
    </>
  );
}

export function OnboardingNameFieldBlock({
  error,
  ...input
}: OnboardingNameFieldProps) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="onboarding-name">
        {onboardingRemainingCopy.displayName}
      </FieldLabel>
      <Input
        {...input}
        id="onboarding-name"
        autoComplete="name"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "onboarding-name-error" : undefined}
      />
      {error && <FieldError id="onboarding-name-error">{error}</FieldError>}
    </Field>
  );
}

export function OnboardingReviewBlock({
  name,
  onBack,
  pending,
}: {
  name: string;
  onBack: () => void;
  pending: boolean;
}) {
  return (
    <section aria-labelledby="onboarding-review-title" className="space-y-3">
      <h2 id="onboarding-review-title" className="type-heading">
        {onboardingStepCopy.reviewTitle}
      </h2>
      <dl>
        <dt className="type-caption">{onboardingRemainingCopy.displayName}</dt>
        <dd className="break-words">{name}</dd>
      </dl>
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={pending}
      >
        {onboardingStepCopy.back}
      </Button>
    </section>
  );
}

export function OnboardingFormBlock({
  children,
  onSubmit,
  pending,
}: {
  children: ReactNode;
  onSubmit: ComponentProps<"form">["onSubmit"];
  pending: boolean;
}) {
  return (
    <form
      method="post"
      className="mx-auto max-w-lg space-y-4"
      onSubmit={onSubmit}
      aria-busy={pending}
      noValidate
    >
      <fieldset disabled={pending} className="space-y-4">
        {children}
      </fieldset>
    </form>
  );
}

export function OnboardingSubmitBlock({
  review,
  pending,
}: {
  review: boolean;
  pending: boolean;
}) {
  return (
    <Button type="submit" disabled={pending}>
      {review
        ? onboardingPresentationCopy.saveProfile
        : onboardingStepCopy.continue}
    </Button>
  );
}

export function OnboardingStatusBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-2">
      <h1 className="type-title">{title}</h1>
      <p className="type-body">{description}</p>
    </section>
  );
}

export function OnboardingResultBlock({
  error,
  saved,
}: {
  error?: string | undefined;
  saved: boolean;
}) {
  return (
    <>
      {error && <FieldError>{error}</FieldError>}
      {saved && <p role="status">{onboardingProfileCopy.saved}</p>}
    </>
  );
}

/** Only the signed-in user's compact DTO is passed here; no organization data. */
export function OnboardingProfileCardBlock({
  profile,
  showEditLink = true,
}: {
  profile: OnboardingProfileDTO;
  showEditLink?: boolean;
}) {
  return (
    <section
      aria-label={onboardingProfileCopy.cardLabel}
      className="space-y-2 rounded-md border border-border p-4"
    >
      <p className="type-heading break-words">{profile.displayName}</p>
      <p className="type-caption">
        {profile.profileCompletedAt
          ? onboardingProfileCopy.complete
          : onboardingProfileCopy.incomplete}
      </p>
      {showEditLink && (
        <Link
          href="/onboarding/profile"
          className="type-link focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {onboardingStepCopy.back}
        </Link>
      )}
    </section>
  );
}

export function OnboardingLoadingBlock() {
  return (
    <div
      role="status"
      aria-label={onboardingProfileCopy.loading}
      className="space-y-4"
    >
      <span className="sr-only">{onboardingProfileCopy.loading}</span>
      <div aria-hidden className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  );
}
