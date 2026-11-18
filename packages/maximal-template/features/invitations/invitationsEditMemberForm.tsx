"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvitationCreateTemplate } from "@/components/templates/invitation-templates";
import { editInvitationWorkflow } from "@/lib/workflows/invitationWorkflows";
import { editInvitationSchema } from "@/schemas/invitationSchemas";
import type {
  InvitationEditFormProps,
  InvitationEditInput,
  InvitationEditValues,
} from "@/types/invitationTypes";

/** Orchestrate edits to a pending invitation without exposing or rotating its token. */
export function InvitationsEditMemberForm({
  invitation,
  onComplete,
}: InvitationEditFormProps) {
  const router = useRouter();
  const [failure, setFailure] = useState<"failed">();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InvitationEditInput, unknown, InvitationEditValues>({
    resolver: zodResolver(editInvitationSchema),
    defaultValues: {
      invitationId: invitation.id,
      email: invitation.email,
      role: invitation.role === "OWNER" ? "MEMBER" : invitation.role,
    },
  });
  return (
    <InvitationCreateTemplate
      editing
      busy={isSubmitting}
      failure={failure}
      error={errors.root?.message}
      emailField={{
        ...register("email"),
        id: `edit-invitation-email-${invitation.id}`,
      }}
      roleField={{
        ...register("role"),
        id: `edit-invitation-role-${invitation.id}`,
      }}
      roles={editInvitationSchema.shape.role.options}
      emailError={errors.email?.message}
      roleError={errors.role?.message}
      onCancel={onComplete}
      onSubmit={handleSubmit(async (values) => {
        setFailure(undefined);
        try {
          const result = await editInvitationWorkflow(values);
          if (!result.ok) {
            for (const name of ["email", "role"] as const) {
              const message = result.error.fieldErrors?.[name]?.[0];
              if (message) setError(name, { message });
            }
            setError("root", { message: result.error.message });
            return;
          }
          router.refresh();
          onComplete();
        } catch {
          setFailure("failed");
        }
      })}
    />
  );
}
