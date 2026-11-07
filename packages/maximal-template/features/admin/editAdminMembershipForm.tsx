"use client";

import { adminMembershipCopy } from "@/content/admin";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { formResultCopy } from "@/content/application";
import {
  changeAdminMembership,
  restoreAdminMembership,
  suspendAdminMembership,
} from "@/lib/actions/adminActions";
import { appRoles } from "@/lib/authz/roles";
import { changeAdminMembershipSchema } from "@/schemas/adminSchemas";
import type { AdminMembershipDTO } from "@/types/adminTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function EditAdminMembershipForm({
  membership,
}: {
  membership: AdminMembershipDTO;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const form = useForm<z.input<typeof changeAdminMembershipSchema>>({
    resolver: zodResolver(changeAdminMembershipSchema),
    defaultValues: { membershipId: membership.id, role: membership.role },
  });
  return (
    <div className="space-y-5">
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          setMessage("");
          try {
            const result = await changeAdminMembership(values);
            if (result.ok) {
              setMessage(adminMembershipCopy.roleUpdated);
              router.refresh();
            } else {
              for (const name of ["membershipId", "role"] as const) {
                const message = result.error.fieldErrors?.[name]?.[0];
                if (message) form.setError(name, { message });
              }
              form.setError("root", { message: result.error.message });
            }
          } catch {
            form.setError("root", { message: formResultCopy.failed });
          }
        })}
        noValidate
      >
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="member-role">
                {adminMembershipCopy.role}
              </FieldLabel>
              <NativeSelect
                {...field}
                id="member-role"
                className="control-field"
                aria-invalid={fieldState.invalid}
              >
                {appRoles.map((role) => (
                  <NativeSelectOption key={role}>{role}</NativeSelectOption>
                ))}
              </NativeSelect>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        <Button type="submit" disabled={pending || form.formState.isSubmitting}>
          {adminMembershipCopy.saveRole}
        </Button>
      </form>
      <Button
        variant="outline"
        disabled={pending || form.formState.isSubmitting}
        onClick={() =>
          startTransition(async () => {
            setMessage("");
            try {
              const result = await (
                membership.status === "SUSPENDED"
                  ? restoreAdminMembership
                  : suspendAdminMembership
              )({ membershipId: membership.id });
              setMessage(
                result.ok
                  ? adminMembershipCopy.accessUpdated
                  : result.error.message,
              );
              if (result.ok) router.refresh();
            } catch {
              setMessage(formResultCopy.failed);
            }
          })
        }
      >
        {membership.status === "SUSPENDED"
          ? adminMembershipCopy.restore
          : adminMembershipCopy.suspend}
      </Button>
      <p role="status">{message}</p>
    </div>
  );
}
