"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  changeAdminMembership,
  suspendAdminMembership,
  restoreAdminMembership,
} from "@/lib/actions/adminActions";
import { useAdminReverification } from "@/lib/auth/clerkAccount";
import { appRoles } from "@/lib/authz/roles";
import { changeAdminMembershipSchema } from "@/schema/adminSchemas";
import { adminMembershipCopy, adminSessionCopy } from "@/content/admin";
import type { AdminMembershipDTO } from "@/types/adminTypes";
export function AdminUserDetailFeatureClient({
  membership,
}: {
  membership: AdminMembershipDTO;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const changeRole = useAdminReverification(changeAdminMembership);
  const suspend = useAdminReverification(suspendAdminMembership);
  const restore = useAdminReverification(restoreAdminMembership);
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
            const result = await changeRole(values);
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
            form.setError("root", { message: adminSessionCopy.cancelled });
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
              <select
                {...field}
                id="member-role"
                className="control-field"
                aria-invalid={fieldState.invalid}
              >
                {appRoles.map((role) => (
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
                membership.status === "SUSPENDED" ? restore : suspend
              )({ membershipId: membership.id });
              setMessage(
                result.ok
                  ? adminMembershipCopy.accessUpdated
                  : result.error.message,
              );
              if (result.ok) router.refresh();
            } catch {
              setMessage(adminSessionCopy.cancelled);
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
