import Link from "next/link";
import type { ReactNode } from "react";
import type { SupportTicketDTO } from "@/types/supportTypes";
import { DashboardLayout } from "@/components/blocks/dashboard-layout";
export function SupportInboxTemplate({
  tickets,
  toolbar,
}: {
  tickets: SupportTicketDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Support inbox" nav={[]} toolbar={toolbar}>
      <p className="text-muted-primary">
        Open conversations ordered by priority. Showing up to 100 tickets.
      </p>
      <div className="divide-y divide-border border border-border">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/support/tickets/${ticket.id}`}
            className="grid gap-3 p-4 hover:bg-primary/10 md:grid-cols-[8rem_1fr_14rem]"
          >
            <div>
              <p className="type-label">#{ticket.number}</p>
              <p>{ticket.priority}</p>
            </div>
            <div>
              <h2 className="type-label">{ticket.subject}</h2>
              <p className="mt-1 text-muted-primary">
                {ticket.requester?.displayName ??
                  ticket.requester?.email ??
                  "Requester"}{" "}
                · {ticket.messageCount} messages
              </p>
            </div>
            <div>
              <p>{ticket.status.replaceAll("_", " ")}</p>
              <p className="text-sm">
                {ticket.assignee?.displayName ?? "Unassigned"}
              </p>
              <p className="text-sm">
                Response due:{" "}
                {ticket.firstResponseDueAt?.slice(0, 16).replace("T", " ") ??
                  "Not set"}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {!tickets.length && <p>No matching open tickets.</p>}
    </DashboardLayout>
  );
}
