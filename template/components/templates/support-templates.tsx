// Why: Templates: pure presentation for the support pages, laid out from DTOs; data and slots come from features.
import type {
  SupportTicketDTO,
  KnowledgeArticleDTO,
} from "@/types/supportTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/dashboard-layout";
import Link from "next/link";
import type { ReactNode } from "react";

export function SupportAnalyticsTemplate({
  tickets,
}: {
  tickets: SupportTicketDTO[];
}) {
  return (
    <DashboardLayout title="Support queue analysis" nav={[]}>
      <p>
        Current non-closed queue, limited to {tickets.length} loaded tickets.
        This is a queue snapshot, not historical response-time reporting.
      </p>
      <DashboardPanel title="Workload by priority">
        <DashboardTable
          columns={[
            { key: "priority", label: "Priority" },
            { key: "count", label: "Tickets" },
            { key: "unassigned", label: "Unassigned" },
            { key: "waiting", label: "Waiting on customer" },
          ]}
          rows={["LOW", "NORMAL", "HIGH", "URGENT"].map((priority) => {
            const group = tickets.filter(
              (ticket) => ticket.priority === priority,
            );
            return {
              id: priority,
              cells: {
                priority,
                count: group.length,
                unassigned: group.filter((ticket) => !ticket.assignee).length,
                waiting: group.filter(
                  (ticket) => ticket.status === "WAITING_ON_CUSTOMER",
                ).length,
              },
            };
          })}
        />
      </DashboardPanel>
    </DashboardLayout>
  );
}

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

export function SupportKnowledgeArticleTemplate({
  article,
}: {
  article: KnowledgeArticleDTO;
}) {
  return (
    <article className="mx-auto max-w-4xl space-y-6 p-5">
      <Link className="type-link" href="/support/knowledge-base">
        Knowledge base
      </Link>
      <header className="space-y-3 border-b border-border pb-5">
        <h1 className="type-title">{article.title}</h1>
        <p>Updated {article.updatedAt.slice(0, 10)}</p>
        <Link
          className="type-link"
          href={`/support/knowledge-base/${article.id}/edit`}
        >
          Edit article
        </Link>
      </header>
      <div className="reading-copy whitespace-pre-wrap">{article.body}</div>
    </article>
  );
}

export function SupportKnowledgeBaseTemplate({
  articles,
  toolbar,
}: {
  articles: KnowledgeArticleDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Knowledge base" nav={[]} toolbar={toolbar}>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <article key={article.id} className="space-y-3 surface-card p-5">
            <Link
              className="type-title hover:underline"
              href={`/support/knowledge-base/${article.id}`}
            >
              {article.title}
            </Link>
            <p className="line-clamp-3 whitespace-pre-wrap text-muted-primary">
              {article.body}
            </p>
            <p className="text-xs">Updated {article.updatedAt.slice(0, 10)}</p>
          </article>
        ))}
      </div>
      {!articles.length && <p>No matching articles.</p>}
    </DashboardLayout>
  );
}

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
