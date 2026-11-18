"use client";
/** RHF orchestration for the mandatory new application-owned profile modal. */
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingTemplate } from "@/components/templates/onboarding-templates";
import { completeOnboardingWorkflow } from "@/lib/workflows/onboardingWorkflows";
import { onboardingSchema } from "@/schemas/authSchemas";
import type {
  AuthProfileFormValues,
  AuthProfileInput,
  OnboardingModalProps,
  OnboardingTemplateProps,
} from "@/types/authTypes";

/** Hydration subscription keeps the native form disabled until handlers are attached. */
const subscribeToHydration = () => () => {};
/** Persist through the workflow; RHF owns validation, submission, and field feedback. */
export function OnboardingNewForm({
  profile,
  onClose,
}: Omit<OnboardingModalProps, "mode">) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const form = useForm<AuthProfileFormValues, unknown, AuthProfileInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      bio: profile.bio ?? "",
      phoneNumber: profile.phoneNumber ?? "",
    },
  });
  const fields: OnboardingTemplateProps["fields"] = {
    firstName: {
      ...form.register("firstName"),
      error: form.formState.errors.firstName?.message,
    },
    lastName: {
      ...form.register("lastName"),
      error: form.formState.errors.lastName?.message,
    },
    bio: { ...form.register("bio"), error: form.formState.errors.bio?.message },
    phoneNumber: {
      ...form.register("phoneNumber"),
      error: form.formState.errors.phoneNumber?.message,
    },
  };
  return (
    <OnboardingTemplate
      profile={profile}
      mode="complete"
      onClose={onClose}
      fields={fields}
      pending={!hydrated || form.formState.isSubmitting}
      saved={saved}
      failed={failed}
      error={form.formState.errors.root?.message}
      onSubmit={form.handleSubmit(async (values) => {
        setSaved(false);
        setFailed(false);
        form.clearErrors("root");
        try {
          const result = await completeOnboardingWorkflow(values);
          if (!result.ok) {
            for (const name of [
              "firstName",
              "lastName",
              "bio",
              "phoneNumber",
            ] as const) {
              const message = result.error.fieldErrors?.[name]?.[0];
              if (message) form.setError(name, { message });
            }
            form.setError("root", { message: result.error.message });
            return;
          }
          setSaved(true);
          router.refresh();
        } catch {
          setFailed(true);
        }
      })}
    />
  );
}
