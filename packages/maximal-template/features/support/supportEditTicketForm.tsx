"use client";

import { SupportTicketControlTemplate } from "@/components/templates/support-templates";
import { useSupportSubmission } from "@/features/support/useSupportSubmission";
import { updateSupportTicketStatusWorkflow } from "@/lib/workflows/supportWorkflows";
import { updateSupportTicketStatusSchema } from "@/schemas/supportSchemas";
import type { SupportTicketDTO } from "@/types/supportTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

/** Submit the supported status control with the displayed ticket version. */
export function SupportEditTicketForm({
  ticket,
  statuses,
}: {
  ticket: Pick<SupportTicketDTO, "id" | "status" | "version">;
  statuses: readonly SupportTicketDTO["status"][];
}) {
  const router = useRouter();
  const form = useForm<
    z.input<typeof updateSupportTicketStatusSchema>,
    unknown,
    z.output<typeof updateSupportTicketStatusSchema>
  >({
    resolver: zodResolver(updateSupportTicketStatusSchema),
    defaultValues: {
      ticketId: ticket.id,
      expectedVersion: ticket.version,
      status: ticket.status,
    },
  });
  const state = useSupportSubmission(
    form,
    updateSupportTicketStatusWorkflow,
    () => {
      router.refresh();
    },
  );
  return (
    <SupportTicketControlTemplate
      kind="status"
      {...state}
      fields={[
        {
          name: "status",
          registration: form.register("status"),
          error: form.formState.errors.status?.message,
          options: statuses,
        },
      ]}
    />
  );
}
