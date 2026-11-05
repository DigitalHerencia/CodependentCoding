"use client";
import { portalRemainingCopy } from "@/content/portal";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { createPortalDocument } from "@/lib/actions/portalActions";
import { createPortalDocumentSchema } from "@/schema/portalSchemas";
import { portalPresentationCopy } from "@/content/portal";
import { formResultCopy } from "@/content/application";

export function PortalDocumentNewForm() {
  const router = useRouter();
  const id = useId();
  const form = useForm<
    z.input<typeof createPortalDocumentSchema>,
    unknown,
    z.output<typeof createPortalDocumentSchema>
  >({
    resolver: zodResolver(createPortalDocumentSchema),
    defaultValues: { title: "", description: "", clientVisible: false },
  });
  return (
    <details className="surface-inset p-4">
      <summary className="cursor-pointer type-label">
        {portalPresentationCopy.createDocument}
      </summary>
      <form
        className="mt-4 space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const result = await createPortalDocument(values);
            if (!result.ok) {
              for (const [name, errors] of Object.entries(
                result.error.fieldErrors ?? {},
              ))
                form.setError(
                  name as FieldPath<z.input<typeof createPortalDocumentSchema>>,
                  { message: errors[0] ?? result.error.message },
                );
              form.setError("root", { message: result.error.message });
              return;
            }
            router.push("/portal/documents/" + result.data.id);
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
              <FieldLabel htmlFor={id + "-title"}>
                {portalRemainingCopy.title}
              </FieldLabel>
              <Input
                {...field}
                id={id + "-title"}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={id + "-description"}>
                {portalRemainingCopy.description}
              </FieldLabel>
              <textarea
                {...field}
                value={field.value ?? ""}
                id={id + "-description"}
                className="control-field w-full"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {portalPresentationCopy.createDocument}
        </Button>
      </form>
    </details>
  );
}
