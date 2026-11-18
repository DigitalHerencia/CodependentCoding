"use client";

/** Invitations New Member Form contracts and composition for the owning application slice. */
import {
  InvitationCreateTemplate,
  InvitationEmailFieldTemplate,
  InvitationRoleFieldTemplate,
} from "@/components/templates/invitation-templates";
import { createInvitationWorkflow } from "@/lib/workflows/invitationClientWorkflows";
import { defaultInvitedRole } from "@/lib/authz/roles";
import { createInvitationSchema } from "@/schemas/invitationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function InvitationsNewMemberForm() {
  const router = useRouter();
  const [failure, setFailure] = useState<"failed">();
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
    <InvitationCreateTemplate
      busy={isSubmitting}
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
    >
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <InvitationEmailFieldTemplate
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <InvitationRoleFieldTemplate
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />
    </InvitationCreateTemplate>
  );
}
