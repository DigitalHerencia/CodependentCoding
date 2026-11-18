"use client";
/** RHF membership editing orchestrates presentation and the single admin workflow API. */
import { useRouter } from "next/navigation";
import { useState, useTransition, useSyncExternalStore } from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminEditUserTemplate } from "@/components/templates/admin-templates";
import {
  changeAdminMembershipWorkflow,
  restoreAdminMembershipWorkflow,
  suspendAdminMembershipWorkflow,
} from "@/lib/workflows/adminWorkflows";
import {
  changeAdminMembershipSchema,
  adminRoleSchema,
} from "@/schemas/adminSchemas";
import type {
  AdminMembershipProps,
  ChangeAdminMembershipCommand,
  AdminEditUserTemplateProps,
} from "@/types/adminTypes";
/** A stable subscription disables native submission until RHF handlers are hydrated. */
const subscribeToHydration = () => () => {};
/** Server-derived editability is checked before this form is mounted; actions recheck it atomically. */
export function AdminEditUserForm({ membership }: AdminMembershipProps) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] =
    useState<AdminEditUserTemplateProps["result"]>(null);
  const form = useForm<ChangeAdminMembershipCommand>({
    resolver: zodResolver(changeAdminMembershipSchema),
    defaultValues: {
      membershipId: membership.id,
      role: adminRoleSchema.parse(membership.role),
    },
  });
  const role = useController({ name: "role", control: form.control });
  return (
    <AdminEditUserTemplate
      membership={membership}
      role={role.field}
      roles={adminRoleSchema.options}
      errors={form.formState.errors}
      result={result}
      pending={!hydrated || pending || form.formState.isSubmitting}
      onSubmit={form.handleSubmit(async (values) => {
        setResult(null);
        form.clearErrors("root");
        try {
          const response = await changeAdminMembershipWorkflow(values);
          if (response.ok) {
            setResult("role");
            router.refresh();
            return;
          }
          for (const name of ["membershipId", "role"] as const) {
            const message = response.error.fieldErrors?.[name]?.[0];
            if (message) form.setError(name, { message });
          }
          form.setError("root", { message: response.error.message });
        } catch {
          form.setError("root", { type: "server" });
        }
      })}
      onToggleAccess={() =>
        startTransition(async () => {
          setResult(null);
          form.clearErrors("root");
          try {
            const response = await (
              membership.status === "SUSPENDED"
                ? restoreAdminMembershipWorkflow
                : suspendAdminMembershipWorkflow
            )({ membershipId: membership.id });
            if (response.ok) {
              setResult("access");
              router.refresh();
            } else form.setError("root", { message: response.error.message });
          } catch {
            setResult("failed");
          }
        })
      }
    />
  );
}
