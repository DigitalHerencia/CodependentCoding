"use client";

import {
  OnboardingNameFieldBlock,
  OnboardingReviewBlock,
} from "@/components/blocks/onboarding-blocks";
import { OnboardingProfileFormTemplate } from "@/components/templates/onboarding-templates";
import { formResultCopy } from "@/content/application";
import {
  completeOnboarding,
  updateOwnOnboardingProfile,
} from "@/lib/actions/onboardingActions";
import { onboardingSchema } from "@/schemas/onboardingSchemas";
import type { OnboardingProfileFormProps } from "@/types/onboardingTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

/** Shared RHF state for new/edit; review never persists or grants access. */
export function OnboardingProfileFormClient({
  displayName,
  mode,
}: OnboardingProfileFormProps) {
  const router = useRouter();
  const form = useForm<z.input<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: displayName },
  });
  const [review, setReview] = useState(false);
  const [saved, setSaved] = useState(false);
  const pending = form.formState.isSubmitting;
  return (
    <OnboardingProfileFormTemplate
      mode={mode}
      review={review}
      pending={pending}
      saved={saved}
      error={form.formState.errors.root?.message}
      onSubmit={form.handleSubmit(async (values) => {
        form.clearErrors("root");
        setSaved(false);
        if (!review) {
          setReview(true);
          return;
        }
        try {
          const result =
            mode === "edit"
              ? await updateOwnOnboardingProfile(values)
              : await completeOnboarding(values);
          if (!result.ok) {
            const message = result.error.fieldErrors?.name?.[0];
            if (message) {
              setReview(false);
              form.setError("name", { message });
            } else form.setError("root", { message: result.error.message });
            return;
          }
          if (mode === "edit") {
            setSaved(true);
            setReview(false);
          }
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      field={
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <OnboardingNameFieldBlock
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
      }
      reviewContent={
        <OnboardingReviewBlock
          name={form.getValues("name")}
          onBack={() => {
            setReview(false);
            setSaved(false);
          }}
          pending={pending}
        />
      }
    />
  );
}
