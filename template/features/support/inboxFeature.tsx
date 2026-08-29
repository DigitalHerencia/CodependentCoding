import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getSupportInbox } from "@/lib/fetchers/supportFetchers";

export async function InboxFeature() {
  const tickets = await getSupportInbox();
  return (
    <div className="space-y-6">
      <PageHeaderBlock eyebrow="Support" title="Inbox" />
      <DataTableBlock
        columns={[
          { key: "ticket", label: "Ticket" },
          { key: "priority", label: "Priority" },
          { key: "status", label: "Status" },
          { key: "requester", label: "Requester" },
          { key: "assignee", label: "Assignee" },
        ]}
        rows={tickets.map((ticket) => ({
          id: ticket.id,
          href: `/support/tickets/${ticket.id}`,
          cells: {
            ticket: `#${ticket.number} · ${ticket.subject}`,
            priority: ticket.priority,
            status: ticket.status,
            requester:
              ticket.requester?.displayName ?? ticket.requester?.email ?? null,
            assignee: ticket.assignee?.displayName ?? null,
          },
        }))}
      />
    </div>
  );
}
