"use client";
import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { formResultCopy } from "@/content/application";
import { portalControlCopy } from "@/content/portal";
import { addPortalDocumentVersion } from "@/lib/actions/portalActions";
import { addPortalDocumentVersionSchema } from "@/schema/portalSchemas";
import type { PortalDocumentDTO } from "@/types/portalTypes";
export function DocumentFeatureClient({
  document,
  assets,
}: {
  document: PortalDocumentDTO;
  assets: { id: string; filename: string }[];
}) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof addPortalDocumentVersionSchema>,
    unknown,
    z.output<typeof addPortalDocumentVersionSchema>
  >({
    resolver: zodResolver(addPortalDocumentVersionSchema),
    defaultValues: {
      documentId: document.id,
      expectedVersion: document.version,
      assetId: "",
      notes: "",
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const result = await addPortalDocumentVersion(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<
                  z.input<typeof addPortalDocumentVersionSchema>
                >,
                { message: messages[0] ?? result.error.message },
              );
            form.setError("root", { message: result.error.message });
            return;
          }
          setMessage(formResultCopy.saved);
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <Controller
        name="assetId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-assetId"}>
              {portalControlCopy.addAVersionFromWorkspaceFiles}
            </FieldLabel>
            <select
              {...field}
              value={String(field.value ?? "")}
              id={id + "-assetId"}
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              <option value="">{portalControlCopy.selectAFile}</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.filename}
                </option>
              ))}
            </select>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="notes"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-notes"}>
              {portalControlCopy.versionNotes}
            </FieldLabel>
            <textarea
              {...field}
              value={String(field.value ?? "")}
              id={id + "-notes"}
              className="control-field min-h-32"
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
      <Button
        type="submit"
        disabled={form.formState.isSubmitting || !assets.length}
      >
        {portalControlCopy.addVersion}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
