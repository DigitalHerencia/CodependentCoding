"use client";

import { formResultCopy } from "@/content/application";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { memberInviteCopy as copy } from "@/content/settings";
import { createInvitation } from "@/lib/actions/commonActions";
import { defaultInvitedRole, invitableRoles } from "@/lib/authz/roles";
import { createInvitationSchema } from "@/schemas/commonSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewMemberInvitationForm() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof createInvitationSchema>,
    unknown,
    z.output<typeof createInvitationSchema>
  >({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: { email: "", role: defaultInvitedRole },
  });

  return (
    <form
      className="space-y-3 surface-card p-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setLink("");
        let result;
        try {
          result = await createInvitation(values);
        } catch {
          setError("root", { message: formResultCopy.failed });
          return;
        }
        if (!result.ok) {
          for (const name of ["email", "role"] as const) {
            const message = result.error.fieldErrors?.[name]?.[0];
            if (message) setError(name, { message });
          }
          setError("root", {
            message: result.error.message,
          });
          return;
        }
        setLink(`${window.location.origin}${result.data.path}`);
        router.refresh();
      })}
    >
      <h2 className="type-heading">{copy.title}</h2>
      <p>{copy.instructions}</p>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="invite-email">{copy.email}</FieldLabel>
            <Input
              id="invite-email"
              type="email"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="invite-role">{copy.role}</FieldLabel>
            <NativeSelect
              id="invite-role"
              className="control-field"
              aria-invalid={fieldState.invalid}
              {...field}
            >
              {invitableRoles.map((role) => (
                <NativeSelectOption key={role}>{role}</NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
      <FieldError>{errors.root?.message}</FieldError>
      {link && (
        <p role="status">
          {copy.share} <code className="break-all">{link}</code>
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {copy.submit}
      </Button>
    </form>
  );
}
