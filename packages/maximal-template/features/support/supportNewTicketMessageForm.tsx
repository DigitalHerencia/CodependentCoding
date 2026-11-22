"use client";

import { SupportTicketControlTemplate } from "@/components/templates/support-templates";
import { useSupportSubmission } from "@/features/support/useSupportSubmission";
import { replyToSupportTicketWorkflow } from "@/lib/workflows/supportWorkflows";
import { supportReplySchema } from "@/schemas/supportSchemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

/** Append a reply and clear the composer after persistence succeeds. */
export function SupportNewTicketMessageForm({
  ticketId,
}: {
  ticketId: string;
}) {
  const router = useRouter();
  const form = useForm<
    z.input<typeof supportReplySchema>,
    unknown,
    z.output<typeof supportReplySchema>
  >({
    resolver: zodResolver(supportReplySchema),
    defaultValues: { ticketId, body: "" },
  });
  const state = useSupportSubmission(form, replyToSupportTicketWorkflow, () => {
    form.reset({ ticketId, body: "" });
    router.refresh();
  });
  return (
    <SupportTicketControlTemplate
      kind="reply"
      {...state}
      fields={[
        {
          name: "reply",
          registration: form.register("body"),
          error: form.formState.errors.body?.message,
          multiline: 5,
        },
      ]}
    />
  );
}
