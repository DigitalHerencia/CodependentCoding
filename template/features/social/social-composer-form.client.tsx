"use client";
import { socialRemainingCopy } from "@/content/social";

import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { createSocialPost } from "@/lib/actions/socialActions";
import { createSocialPostSchema } from "@/schema/socialSchemas";
import { SocialComposeTemplate } from "@/components/templates/social-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { socialPresentationCopy, socialPreviewCopy } from "@/content/social";
import { formResultCopy } from "@/content/application";
import type { SocialAccountDTO } from "@/types/socialTypes";
export function ComposerFeatureClient({
  accounts,
}: {
  accounts: SocialAccountDTO[];
}) {
  const router = useRouter();
  const form = useForm<z.input<typeof createSocialPostSchema>>({
    resolver: zodResolver(createSocialPostSchema),
    defaultValues: { title: "", content: "", variants: [] },
  });
  const values = useWatch({ control: form.control });
  const content = values.content ?? "";
  const variants = values.variants ?? [];
  return (
    <SocialComposeTemplate
      preview={
        <>
          <p className="type-label">{values.title}</p>
          <p className="whitespace-pre-wrap">
            {content || socialRemainingCopy.yourPostPreviewWillAppearHere}
          </p>
          <p className="text-muted-primary">
            {content.length} {socialPreviewCopy.characters} {variants.length}{" "}
            {socialPreviewCopy.channels}
          </p>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const result = await createSocialPost({
              ...values,
              variants: values.variants.map((variant) => ({
                ...variant,
                content: values.content,
              })),
            });
            if (!result.ok) {
              for (const [name, errors] of Object.entries(
                result.error.fieldErrors ?? {},
              ))
                form.setError(
                  name as FieldPath<z.input<typeof createSocialPostSchema>>,
                  { message: errors[0] ?? result.error.message },
                );
              form.setError("root", { message: result.error.message });
              return;
            }
            router.push("/social/calendar");
            router.refresh();
          } catch {
            form.setError("root", { message: formResultCopy.failed });
          }
        })}
        noValidate
      >
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="social-title">
                {socialRemainingCopy.internalTitle}
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="social-title"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="social-content">
                {socialRemainingCopy.postContent}
              </FieldLabel>
              <textarea
                {...field}
                id="social-content"
                className="control-field min-h-64"
                aria-invalid={fieldState.invalid}
                onChange={(event) => {
                  field.onChange(event);
                  form.setValue(
                    "variants",
                    form.getValues("variants").map((variant) => ({
                      ...variant,
                      content: event.target.value,
                    })),
                  );
                }}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="variants"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <fieldset className="space-y-2">
                <legend className="type-label">
                  {socialRemainingCopy.publishDestinations}
                </legend>
                {accounts.map((account) => (
                  <FieldLabel
                    className="flex items-center gap-3"
                    key={account.id}
                  >
                    <input
                      type="checkbox"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      checked={field.value.some(
                        (variant) => variant.socialAccountId === account.id,
                      )}
                      aria-invalid={fieldState.invalid}
                      onChange={(event) =>
                        field.onChange(
                          event.target.checked
                            ? [
                                ...field.value,
                                {
                                  socialAccountId: account.id,
                                  content: form.getValues("content"),
                                },
                              ]
                            : field.value.filter(
                                (variant) =>
                                  variant.socialAccountId !== account.id,
                              ),
                        )
                      }
                    />
                    {account.displayName} · {account.provider}
                  </FieldLabel>
                ))}
                {!accounts.length && (
                  <p>
                    {socialRemainingCopy.noActiveSocialAccountsAreAvailable}
                  </p>
                )}
              </fieldset>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !variants.length}
        >
          {form.formState.isSubmitting
            ? socialPresentationCopy.saving
            : socialPresentationCopy.saveDraft}
        </Button>
      </form>
    </SocialComposeTemplate>
  );
}
