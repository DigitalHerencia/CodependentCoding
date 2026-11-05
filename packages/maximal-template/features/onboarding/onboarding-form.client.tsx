"use client";
import { onboardingRemainingCopy } from "@/content/onboarding";

import { formResultCopy } from "@/content/application";
import { OnboardingApprovalBlock } from "@/components/blocks/onboarding-blocks";
import {
  onboardingPresentationCopy,
  onboardingStepCopy,
} from "@/content/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  claimWorkspaceApproval,
  completeOnboarding,
} from "@/lib/actions/onboardingActions";
import { onboardingSchema } from "@/schema/commonSchemas";

export function OnboardingFeatureClient({
  displayName,
}: {
  displayName: string;
}) {
  const router = useRouter();
  const form = useForm<z.input<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: displayName },
  });
  const [review, setReview] = useState(false);
  const error = form.formState.errors.root;

  return (
    <form
      className="mx-auto max-w-lg space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        if (!review) {
          setReview(true);
          return;
        }
        try {
          const result = await completeOnboarding(values);
          if (!result.ok) {
            const message = result.error.fieldErrors?.name?.[0];
            if (message) {
              setReview(false);
              form.setError("name", { message });
            } else form.setError("root", { message: result.error.message });
            return;
          }
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <h1 className="text-2xl font-semibold">
        {onboardingPresentationCopy.completeYourProfile}
      </h1>
      <ol aria-label={onboardingStepCopy.steps} className="flex gap-4">
        <li aria-current={!review ? "step" : undefined}>
          {onboardingStepCopy.profile}
        </li>
        <li aria-current={review ? "step" : undefined}>
          {onboardingStepCopy.review}
        </li>
      </ol>
      {review ? (
        <section>
          <h2>{onboardingStepCopy.reviewTitle}</h2>
          <p>{form.getValues("name")}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setReview(false)}
          >
            {onboardingStepCopy.back}
          </Button>
        </section>
      ) : (
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="onboarding-name">
                {onboardingRemainingCopy.displayName}
              </FieldLabel>
              <Input
                {...field}
                id="onboarding-name"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />
      )}
      {error && <FieldError>{error.message}</FieldError>}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {review
          ? onboardingPresentationCopy.saveProfile
          : onboardingStepCopy.continue}
      </Button>
    </form>
  );
}

export function WorkspaceApprovalCheck() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <OnboardingApprovalBlock
      pending={pending}
      message={message}
      onCheck={() =>
        startTransition(async () => {
          setMessage("");
          const result = await claimWorkspaceApproval();
          if (!result.ok) {
            setMessage(
              result.error.code === "NOT_FOUND"
                ? onboardingStepCopy.noApproval
                : result.error.message,
            );
            return;
          }
          router.refresh();
        })
      }
    />
  );
}
