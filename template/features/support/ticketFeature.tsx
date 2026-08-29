import {
  EmptyStateBlock,
  PageHeaderBlock,
  RecordDetailBlock,
} from "@/components/blocks/application-sections";
import { getSupportTicket } from "@/lib/fetchers/supportFetchers";

export async function TicketFeature({ ticketId }: { ticketId: string }) {
  const ticket = await getSupportTicket(ticketId);
  if (!ticket)
    return (
      <EmptyStateBlock
        title="Ticket not found"
        description="No visible support ticket matches this identifier."
      />
    );
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow={`Ticket #${ticket.number}`}
        title={ticket.subject}
      />
      <RecordDetailBlock
        title="Support request"
        status={ticket.status}
        items={[
          { label: "Priority", value: ticket.priority },
          {
            label: "Requester",
            value:
              ticket.requester?.displayName ?? ticket.requester?.email ?? "—",
          },
          {
            label: "Assignee",
            value: ticket.assignee?.displayName ?? "Unassigned",
          },
          { label: "Messages", value: String(ticket.messageCount) },
          {
            label: "First response due",
            value: ticket.firstResponseDueAt
              ? new Date(ticket.firstResponseDueAt).toLocaleString()
              : "—",
          },
          {
            label: "Resolution due",
            value: ticket.resolutionDueAt
              ? new Date(ticket.resolutionDueAt).toLocaleString()
              : "—",
          },
          { label: "Description", value: ticket.description ?? "—" },
        ]}
      />
    </div>
  );
}
