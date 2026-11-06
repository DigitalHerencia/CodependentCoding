"use client";

import {
  SettingsFormButtonBlock as Button,
  SettingsFormFieldBlock as Field,
  SettingsFormFieldErrorBlock as FieldError,
  SettingsFormFieldLabelBlock as FieldLabel,
  SettingsFormInputBlock as Input,
} from "@/components/blocks/settings-form-blocks";
import { formResultCopy } from "@/content/application";
import { settingsControlCopy } from "@/content/settings";
import { updateOrganizationSettings } from "@/lib/actions/commonActions";
import { organizationSettingsSchema } from "@/schemas/commonSchemas";
import type { OrganizationDTO } from "@/types/commonTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";

export function EditOrganizationSettingsForm({
  organization,
}: {
  organization: OrganizationDTO;
}) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof organizationSettingsSchema>,
    unknown,
    z.output<typeof organizationSettingsSchema>
  >({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: {
      timezone: organization.timezone,
      locale: organization.locale,
      defaultCurrency: organization.defaultCurrency,
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const result = await updateOrganizationSettings(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<z.input<typeof organizationSettingsSchema>>,
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
        name="timezone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-timezone"}>
              {settingsControlCopy.timeZone}
            </FieldLabel>
            <Input
              {...field}
              value={String(field.value ?? "")}
              id={id + "-timezone"}
              type="text"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="locale"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-locale"}>
              {settingsControlCopy.locale}
            </FieldLabel>
            <Input
              {...field}
              value={String(field.value ?? "")}
              id={id + "-locale"}
              type="text"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="defaultCurrency"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-defaultCurrency"}>
              {settingsControlCopy.defaultCurrency}
            </FieldLabel>
            <Input
              {...field}
              value={String(field.value ?? "")}
              id={id + "-defaultCurrency"}
              type="text"
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
        {settingsControlCopy.savePreferences}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
