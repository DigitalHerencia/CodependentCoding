"use client";
/** Invitations Edit Acceptance Form contracts and composition for the owning application slice. */
import { useState } from "react";

import { InvitationAcceptanceTemplate } from "@/components/templates/invitation-templates";
import { acceptInvitationWorkflow } from "@/lib/workflows/invitationWorkflows";
import { acceptInvitationSchema } from "@/schemas/invitationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type {
  InvitationAcceptanceInput,
  InvitationAcceptanceProps,
} from "@/types/invitationTypes";

/** Validate and submit the invitation token using the acceptance workflow. */
export function InvitationsEditAcceptanceForm({
  token,
}: InvitationAcceptanceProps) {
  const router = useRouter();
  const [failure, setFailure] = useState<"invalid" | "failed">();
  const form = useForm<InvitationAcceptanceInput>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { token },
  });
  return (
    <InvitationAcceptanceTemplate
      busy={form.formState.isSubmitting}
      failure={failure}
      onSubmit={form.handleSubmit(async (values) => {
        setFailure(undefined);
        try {
          const result = await acceptInvitationWorkflow(values);
          if (!result.ok) {
            setFailure("invalid");
            return;
          }
          router.push("/dashboard");
          router.refresh();
        } catch {
          setFailure("failed");
        }
      })}
    />
  );
}
