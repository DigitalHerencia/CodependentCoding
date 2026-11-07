"use client";

import { formResultCopy } from "@/content/application";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { onboardingPresentationCopy } from "@/content/onboarding";
import { acceptInvitation } from "@/lib/actions/commonActions";
import { acceptInvitationSchema } from "@/schemas/commonSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export function EditInvitationAcceptanceForm({ token }: { token: string }) {
  const router = useRouter();
  const form = useForm<z.input<typeof acceptInvitationSchema>>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { token },
  });
  return (
    <form
      className="mx-auto max-w-lg space-y-4 surface-card p-5"
      onSubmit={form.handleSubmit(async (values) => {
        try {
          const result = await acceptInvitation(values);
          if (!result.ok) {
            form.setError("root", {
              message:
                onboardingPresentationCopy.thisInvitationIsNotValidForYourAccountIt,
            });
            return;
          }
          router.push("/dashboard");
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <h1 className="type-title">
        {onboardingPresentationCopy.joinTheWorkspace}
      </h1>
      <p>{onboardingPresentationCopy.youWereInvitedToAWorkspaceAcceptToJoin}</p>
      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {onboardingPresentationCopy.acceptInvitation}
      </Button>
    </form>
  );
}
