"use client";

import { formResultCopy } from "@/content/application";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  uploadsPresentationCopy,
  uploadsRemainingCopy,
} from "@/content/uploads";
import { uploadWorkspaceAsset } from "@/lib/actions/uploadsActions";
import { workspaceUploadSchema } from "@/schemas/uploadsSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewWorkspaceFileForm({
  domain,
}: {
  domain: "portal" | "social";
}) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof workspaceUploadSchema>,
    unknown,
    z.output<typeof workspaceUploadSchema>
  >({
    resolver: zodResolver(workspaceUploadSchema),
    defaultValues: { domain, file: null },
  });
  return (
    <form
      className="space-y-3 surface-inset p-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const data = new FormData();
          data.set("domain", values.domain);
          data.set("file", values.file);
          const result = await uploadWorkspaceAsset(data);
          if (!result.ok) {
            if (result.error.fieldErrors?.file?.[0])
              form.setError("file", {
                message: result.error.fieldErrors.file[0],
              });
            form.setError("root", { message: result.error.message });
            return;
          }
          setMessage(
            uploadsPresentationCopy.fileUploadedToPrivateWorkspaceStorage,
          );
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <Controller
        name="file"
        control={form.control}
        render={({
          field: { value: _file, onChange, ...field },
          fieldState,
        }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>
              {uploadsRemainingCopy.uploadWorkspaceFileUpTo750KB}
            </FieldLabel>
            <Input
              {...field}
              id={id}
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onChange(file);
                else onChange(null);
              }}
              disabled={form.formState.isSubmitting}
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
        {form.formState.isSubmitting
          ? uploadsPresentationCopy.uploading
          : uploadsPresentationCopy.uploadFile}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
