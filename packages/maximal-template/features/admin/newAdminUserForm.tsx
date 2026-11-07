"use client";

import {
  AdminFormNativeSelectBlock,
  AdminFormNativeSelectOptionBlock,
  AdminFormButtonBlock as Button,
  AdminFormFieldBlock as Field,
  AdminFormFieldErrorBlock as FieldError,
  AdminFormFieldLabelBlock as FieldLabel,
  AdminFormInputBlock as Input,
} from "@/components/blocks/admin-form-blocks";
import { adminPresentationCopy, adminRemainingCopy } from "@/content/admin";
import { formResultCopy } from "@/content/application";
import { addAdminMembership } from "@/lib/actions/adminActions";
import { invitableRoles } from "@/lib/authz/roles";
import { addAdminMembershipSchema } from "@/schemas/adminSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewAdminUserForm() {
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
        let result;
        try {
          result = await addAdminMembership(values);
        } catch {
          form.setError("root", { message: formResultCopy.failed });
          return;
        }
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
      noValidate
    >
      <h1 className="type-title">
        {adminPresentationCopy.approveWorkspaceAccess}
      </h1>
      <p>{adminPresentationCopy.assignARoleInThisWorkspaceTheUserCan}</p>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="member-email">
              {adminRemainingCopy.registeredEmail}
            </FieldLabel>
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
            <FieldLabel htmlFor="new-member-role">
              {adminRemainingCopy.applicationRole}
            </FieldLabel>
            <AdminFormNativeSelectBlock
              {...field}
              id="new-member-role"
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              {invitableRoles.map((role) => (
                <AdminFormNativeSelectOptionBlock key={role}>
                  {role}
                </AdminFormNativeSelectOptionBlock>
              ))}
            </AdminFormNativeSelectBlock>
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
          {adminPresentationCopy.accessApprovedTheUserCanCheckTheirAccessNow}
        </p>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {adminPresentationCopy.approveAccess}
      </Button>
    </form>
  );
}
