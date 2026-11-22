import {
  SupportTicketTemplate,
  SupportUnavailableTemplate,
} from "@/components/templates/support-templates";
import { SupportEditTicketForm } from "@/features/support/supportEditTicketForm";
import { SupportNewTicketMessageForm } from "@/features/support/supportNewTicketMessageForm";
import { loadTicketWorkflow } from "@/lib/workflows/supportWorkflows";
import { supportPager } from "@/lib/utils/supportPager";
import type { SupportSearchParams } from "@/types/supportTypes";

/** Compose authorized ticket metadata, visible history and permitted controls. */
export async function SupportTicketFeature({
  params,
  searchParams,
}: {
  params: Promise<{ ticketId: string }>;
  searchParams: Promise<SupportSearchParams>;
}) {
  const [{ ticketId }, { page: pageParam }] = await Promise.all([
    params,
    searchParams,
  ]);
  const result = await loadTicketWorkflow(ticketId, pageParam);
  if (!result.ok)
    return (
      <SupportUnavailableTemplate page="ticket" code={result.error.code} />
    );
  const {
    ticket,
    messages,
    page,
    hasMore,
    canReply,
    canUpdateStatus,
    statuses,
    resolutionOverdue,
  } = result.data;
  return (
    <SupportTicketTemplate
      ticket={ticket}
      messages={messages}
      resolutionOverdue={resolutionOverdue}
      pager={supportPager(`/support/tickets/${ticket.id}`, page, hasMore)}
    >
      <div className="space-y-5">
        {canReply && (
          <SupportNewTicketMessageForm key={ticket.id} ticketId={ticket.id} />
        )}
        {canUpdateStatus && (
          <SupportEditTicketForm
            key={ticket.version}
            ticket={{
              id: ticket.id,
              status: ticket.status,
              version: ticket.version,
            }}
            statuses={statuses}
          />
        )}
      </div>
    </SupportTicketTemplate>
  );
}
