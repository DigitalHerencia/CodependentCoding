import type { ReactNode } from "react";
import type { SupportTicketDTO } from "@/types/supportTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
export function SupportTicketTemplate({
  ticket,
  messages,
  children,
}: {
  ticket: SupportTicketDTO;
  messages: {
    id: string;
    body: string;
    authorLabel: string;
    isInternal: boolean;
    createdAt: string;
  }[];
  children: ReactNode;
}) {
  return (
    <DashboardLayout title={`#${ticket.number} · ${ticket.subject}`} nav={[]}>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title="Conversation">
          <p className="border-b border-border pb-5 whitespace-pre-wrap">
            {ticket.description ?? "No opening description."}
          </p>
          <ol className="space-y-4 py-5">
            {messages.map((message) => (
              <li key={message.id} className="surface-inset p-4">
                <p className="type-label">
                  {message.authorLabel}{" "}
                  {message.isInternal && "· Internal note"}
                </p>
                <time className="text-xs text-muted-primary">
                  {message.createdAt.slice(0, 16).replace("T", " ")}
                </time>
                <p className="mt-3 whitespace-pre-wrap">{message.body}</p>
              </li>
            ))}
          </ol>
          {children}
        </DashboardPanel>
        <DashboardPanel title="Triage">
          <dl className="space-y-2">
            <dt>Requester</dt>
            <dd>
              {ticket.requester?.displayName ??
                ticket.requester?.email ??
                "Unknown"}
            </dd>
            <dt>Assignee</dt>
            <dd>{ticket.assignee?.displayName ?? "Unassigned"}</dd>
            <dt>Priority</dt>
            <dd>{ticket.priority}</dd>
            <dt>Status</dt>
            <dd>{ticket.status}</dd>
            <dt>Resolution due</dt>
            <dd>{ticket.resolutionDueAt ?? "Not set"}</dd>
          </dl>
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}
