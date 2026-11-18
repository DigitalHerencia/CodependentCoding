"use client";
/** BoldKit onboarding form pattern adapted to an application-owned, mandatory modal.
 * @see https://boldkit.dev
 */
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { onboardingCopy } from "@/content/onboarding";
import type { OnboardingTemplateProps } from "@/types/authTypes";

/** Completion cannot be dismissed by Escape, outside interaction, or a close button. */
export function OnboardingModalBlock({
  children,
  mode,
  onClose,
}: Pick<OnboardingTemplateProps, "mode" | "onClose"> & {
  children: ReactNode;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && mode === "edit") onClose?.();
      }}
    >
      <DialogContent
        showCloseButton={mode === "edit"}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
        onEscapeKeyDown={(event) => {
          if (mode === "complete") event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (mode === "complete") event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "complete"
              ? onboardingCopy.title
              : onboardingCopy.editTitle}
          </DialogTitle>
          <DialogDescription>
            {mode === "complete"
              ? onboardingCopy.description
              : onboardingCopy.editDescription}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
/** Profile labels and native form primitives remain in the block layer. */
export function OnboardingFieldsBlock({
  fields,
}: Pick<OnboardingTemplateProps, "fields">) {
  return (
    <>
      {(["firstName", "lastName", "bio", "phoneNumber"] as const).map(
        (name) => {
          const { error, ...field } = fields[name];
          const id = "onboarding-" + name;
          return (
            <Field key={name} data-invalid={Boolean(error)}>
              <FieldLabel htmlFor={id}>{onboardingCopy[name]}</FieldLabel>
              {name === "bio" ? (
                <Textarea
                  {...field}
                  id={id}
                  rows={3}
                  maxLength={2000}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? id + "-error" : undefined}
                />
              ) : (
                <Input
                  {...field}
                  id={id}
                  type={name === "phoneNumber" ? "tel" : "text"}
                  autoComplete={
                    name === "firstName"
                      ? "given-name"
                      : name === "lastName"
                        ? "family-name"
                        : "tel"
                  }
                  maxLength={name === "phoneNumber" ? 32 : 100}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? id + "-error" : undefined}
                />
              )}
              {error && <FieldError id={id + "-error"}>{error}</FieldError>}
            </Field>
          );
        },
      )}
    </>
  );
}
/** Busy native POST forms avoid submitting optional profile data through a URL. */
export function OnboardingFormBlock({
  children,
  onSubmit,
  pending,
}: Pick<OnboardingTemplateProps, "onSubmit" | "pending"> & {
  children: ReactNode;
}) {
  return (
    <form method="post" onSubmit={onSubmit} aria-busy={pending} noValidate>
      <fieldset disabled={pending} className="space-y-4 disabled:opacity-70">
        {children}
      </fieldset>
    </form>
  );
}
/** Successful completion and network failures are announced without raw diagnostics. */
export function OnboardingResultBlock({
  pending,
  saved,
  failed,
  error,
}: Pick<OnboardingTemplateProps, "pending" | "saved" | "failed" | "error">) {
  return (
    <>
      {(error || failed) && (
        <FieldError>{failed ? onboardingCopy.failed : error}</FieldError>
      )}
      {saved && <p role="status">{onboardingCopy.saved}</p>}
      <Button type="submit" className="w-full">
        {pending ? onboardingCopy.saving : onboardingCopy.save}
      </Button>
    </>
  );
}
