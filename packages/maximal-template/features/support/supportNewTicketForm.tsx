"use client";

import { SupportNewTicketTemplate } from "@/components/templates/support-templates";
import { useSupportSubmission } from "@/features/support/useSupportSubmission";
import { createSupportTicketWorkflow } from "@/lib/workflows/supportWorkflows";
import {
  createSupportTicketSchema,
  TicketPriority,
} from "@/schemas/supportSchemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

/** Collect new ticket fields and navigate to the allocated ticket. */
export function SupportNewTicketForm() {
  const router = useRouter();
  const form = useForm<
    z.input<typeof createSupportTicketSchema>,
    unknown,
    z.output<typeof createSupportTicketSchema>
  >({
    resolver: zodResolver(createSupportTicketSchema),
    defaultValues: { subject: "", description: "", priority: "NORMAL" },
  });
  const state = useSupportSubmission(
    form,
    createSupportTicketWorkflow,
    (result) => {
      router.push(`/support/tickets/${result.id}`);
      router.refresh();
    },
  );
  return (
    <SupportNewTicketTemplate
      kind="newTicket"
      {...state}
      fields={[
        {
          name: "subject",
          registration: form.register("subject"),
          error: form.formState.errors.subject?.message,
        },
        {
          name: "description",
          registration: form.register("description"),
          error: form.formState.errors.description?.message,
          multiline: 8,
        },
        {
          name: "priority",
          registration: form.register("priority"),
          error: form.formState.errors.priority?.message,
          options: Object.values(TicketPriority),
        },
      ]}
    />
  );
}
