"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addAdminMembership } from "@/lib/actions/adminActions";
import { invitableRoles } from "@/lib/authz/roles";
import { addAdminMembershipSchema } from "@/schemas/adminSchemas";

export function AdminNewUserForm() {
  const [approved, setApproved] = useState(false);
  const form = useForm<z.input<typeof addAdminMembershipSchema>>({
    resolver: zodResolver(addAdminMembershipSchema),
    defaultValues: { email: "", role: "MEMBER" },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={form.handleSubmit(async (values) => {
        setApproved(false);
        const result = await addAdminMembership(values);
        if (result.ok) {
          form.reset();
          setApproved(true);
          return;
        }
        for (const name of ["email", "role"] as const) {
          const message = result.error.fieldErrors?.[name]?.[0];
          if (message) form.setError(name, { message });
        }
        form.setError("root", { message: result.error.message });
      })}
    >
      <h1 className="type-title">Approve workspace access</h1>
      <p>
        Assign a role in this workspace. The user can claim access from their
        waiting page using this verified email.
      </p>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="member-email">Registered email</FieldLabel>
            <Input
              {...field}
              id="member-email"
              type="email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="role"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="new-member-role">Application role</FieldLabel>
            <select
              {...field}
              id="new-member-role"
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              {invitableRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
      {approved && (
        <p role="status">
          Access approved. The user can check their access now.
        </p>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Approve access
      </Button>
    </form>
  );
}
