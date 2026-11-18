"use client";
/** RHF owns field state and orchestrates the new-access template and server workflow.
 * @see https://react-hook-form.com/docs/usecontroller
 */
import { useState, useSyncExternalStore } from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminNewUserTemplate } from "@/components/templates/admin-templates";
import { addAdminMembershipWorkflow } from "@/lib/workflows/adminWorkflows";
import {
  addAdminMembershipSchema,
  adminRoleSchema,
} from "@/schemas/adminSchemas";
import type { AddAdminMembershipCommand } from "@/types/adminTypes";
/** A stable subscription disables native submission until RHF handlers are hydrated. */
const subscribeToHydration = () => () => {};
/** Preserve existing verified-email approvals without provider or tenancy imports. */
export function AdminNewUserForm() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [approved, setApproved] = useState(false);
  const form = useForm<AddAdminMembershipCommand>({
    resolver: zodResolver(addAdminMembershipSchema),
    defaultValues: { email: "", role: "MEMBER" },
  });
  const email = useController({ name: "email", control: form.control });
  const role = useController({ name: "role", control: form.control });
  return (
    <AdminNewUserTemplate
      email={email.field}
      role={role.field}
      roles={adminRoleSchema.options}
      errors={form.formState.errors}
      pending={!hydrated || form.formState.isSubmitting}
      approved={approved}
      onSubmit={form.handleSubmit(async (values) => {
        setApproved(false);
        form.clearErrors("root");
        try {
          const result = await addAdminMembershipWorkflow(values);
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
        } catch {
          form.setError("root", { type: "server" });
        }
      })}
    />
  );
}
