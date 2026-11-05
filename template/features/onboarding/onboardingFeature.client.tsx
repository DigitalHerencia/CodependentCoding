"use client";

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
import { onboardingSchema } from "@/schemas/commonSchemas";

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
  const error = form.formState.errors.root;

  return (
    <form
      className="mx-auto max-w-lg space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const result = await completeOnboarding(values);
        if (!result.ok) {
          const message = result.error.fieldErrors?.name?.[0];
          if (message) form.setError("name", { message });
          else form.setError("root", { message: result.error.message });
          return;
        }
        router.refresh();
      })}
    >
      <h1 className="text-2xl font-semibold">Complete your profile</h1>
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="onboarding-name">Display name</FieldLabel>
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
      {error && <FieldError>{error.message}</FieldError>}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Save profile
      </Button>
    </form>
  );
}

export function WorkspaceApprovalCheck() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <>
      <Button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setMessage("");
            const result = await claimWorkspaceApproval();
            if (!result.ok) {
              setMessage(
                result.error.code === "NOT_FOUND"
                  ? "No approval is available for your verified primary email yet."
                  : result.error.message,
              );
              return;
            }
            router.refresh();
          })
        }
      >
        Check access
      </Button>
      {message && <p role="status">{message}</p>}
    </>
  );
}
