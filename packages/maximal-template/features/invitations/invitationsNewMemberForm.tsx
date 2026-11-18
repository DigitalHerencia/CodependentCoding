"use client";

/** Invitations New Member Form contracts and composition for the owning application slice. */
import { InvitationCreateTemplate } from "@/components/templates/invitation-templates";
import { createInvitationWorkflow } from "@/lib/workflows/invitationWorkflows";
import { createInvitationSchema } from "@/schemas/invitationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type {
  InvitationCreateInput,
  InvitationCreateValues,
} from "@/types/invitationTypes";

/** Orchestrate invitation form validation and its authenticated creation workflow. */
export function InvitationsNewMemberForm() {
  const router = useRouter();
  const [failure, setFailure] = useState<"failed">();
  const [link, setLink] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InvitationCreateInput, unknown, InvitationCreateValues>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: { email: "", role: "MEMBER" },
  });

  return (
    <InvitationCreateTemplate
      busy={isSubmitting}
      emailField={{ ...register("email"), id: "new-invitation-email" }}
      roleField={{ ...register("role"), id: "new-invitation-role" }}
      roles={createInvitationSchema.shape.role.options}
      emailError={errors.email?.message}
      roleError={errors.role?.message}
      failure={failure}
      error={errors.root?.message}
      link={link}
      onSubmit={handleSubmit(async (values) => {
        setLink("");
        setFailure(undefined);
        let result;
        try {
          result = await createInvitationWorkflow(values);
        } catch {
          setFailure("failed");
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
    />
  );
}
