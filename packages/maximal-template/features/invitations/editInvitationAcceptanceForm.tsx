"use client";

import { formResultCopy } from "@/content/application";
import { InvitationAcceptanceTemplate } from "@/components/templates/invitation-templates";
import { invitationContent } from "@/content/invitations";
import { acceptInvitationWorkflow } from "@/lib/workflows/invitationClientWorkflows";
import { acceptInvitationSchema } from "@/schemas/invitationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export function EditInvitationAcceptanceForm({ token }: { token: string }) {
  const router = useRouter();
  const form = useForm<z.input<typeof acceptInvitationSchema>>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { token },
  });
  return (
    <InvitationAcceptanceTemplate
      busy={form.formState.isSubmitting}
      error={form.formState.errors.root?.message}
      onSubmit={form.handleSubmit(async (values) => {
        try {
          const result = await acceptInvitationWorkflow(values);
          if (!result.ok) {
            form.setError("root", {
              message: invitationContent.invalid,
            });
            return;
          }
          router.push("/dashboard");
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
    />
  );
}
