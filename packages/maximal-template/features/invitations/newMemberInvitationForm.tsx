"use client";

import { formResultCopy } from "@/content/application";
import {
  InvitationEmailFieldBlock,
  InvitationRoleFieldBlock,
} from "@/components/blocks/invitation-blocks";
import { InvitationCreateTemplate } from "@/components/templates/invitation-templates";
import { createInvitationWorkflow } from "@/lib/workflows/invitationClientWorkflows";
import { defaultInvitedRole } from "@/lib/authz/roles";
import { createInvitationSchema } from "@/schemas/invitationSchemas";
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
    <InvitationCreateTemplate
      busy={isSubmitting}
      error={errors.root?.message}
      link={link}
      onSubmit={handleSubmit(async (values) => {
        setLink("");
        let result;
        try {
          result = await createInvitationWorkflow(values);
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
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <InvitationEmailFieldBlock
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <InvitationRoleFieldBlock
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />
    </InvitationCreateTemplate>
  );
}
