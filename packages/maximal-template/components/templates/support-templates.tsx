import { supportRemainingCopy } from "@/content/support";
import { supportPresentationCopy } from "@/content/support";
// Why: Templates: pure presentation for the support pages, laid out from DTOs; data and slots come from features.
import type {
  SupportTicketDTO,
  KnowledgeArticleDTO,
} from "@/types/supportTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import Link from "next/link";
import type { ReactNode } from "react";

export function SupportAnalyticsTemplate({
  tickets,
}: {
  tickets: SupportTicketDTO[];
}) {
  return (
    <DashboardLayout
      title={supportPresentationCopy.supportQueueAnalysis}
      nav={[]}
    >
      <p>
        {supportPresentationCopy.currentNonClosedQueueLimitedTo}
        {tickets.length}
        {supportPresentationCopy.loadedTicketsThisIsAQueueSnapshotNotHistorical}
      </p>
      <DashboardPanel title={supportPresentationCopy.workloadByPriority}>
        <DashboardTable
          columns={[
            { key: "priority", label: supportPresentationCopy.priority },
            { key: "count", label: supportPresentationCopy.tickets },
            { key: "unassigned", label: supportPresentationCopy.unassigned },
            {
              key: "waiting",
              label: supportPresentationCopy.waitingOnCustomer,
            },
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
    <DashboardLayout
      title={supportPresentationCopy.supportInbox}
      nav={[]}
      toolbar={toolbar}
    >
      <p className="text-muted-primary">
        {
          supportPresentationCopy.openConversationsOrderedByPriorityShowingUpTo100
        }
      </p>
      <div className="divide-y divide-border border border-border">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/support/tickets/${ticket.id}`}
            className="grid gap-3 p-4 hover:bg-primary/10 md:grid-cols-[8rem_1fr_14rem]"
          >
            <div>
              <p className="type-label">
                {supportPresentationCopy.numberPrefix}
                {ticket.number}
              </p>
              <p>{ticket.priority}</p>
            </div>
            <div>
              <h2 className="type-label">{ticket.subject}</h2>
              <p className="mt-1 text-muted-primary">
                {ticket.requester?.displayName ??
                  ticket.requester?.email ??
                  supportPresentationCopy.requester}{" "}
                {supportPresentationCopy.separator}
                {ticket.messageCount}
                {supportPresentationCopy.messages}
              </p>
            </div>
            <div>
              <p>{ticket.status.replaceAll("_", " ")}</p>
              <p className="text-sm">
                {ticket.assignee?.displayName ??
                  supportPresentationCopy.unassigned}
              </p>
              <p className="text-sm">
                {supportPresentationCopy.responseDue}{" "}
                {ticket.firstResponseDueAt?.slice(0, 16).replace("T", " ") ??
                  supportPresentationCopy.notSet}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {!tickets.length && (
        <p>{supportPresentationCopy.noMatchingOpenTickets}</p>
      )}
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
        {supportPresentationCopy.knowledgeBase}
      </Link>
      <header className="space-y-3 border-b border-border pb-5">
        <h1 className="type-title">{article.title}</h1>
        <p>
          {supportPresentationCopy.updated}
          {article.updatedAt.slice(0, 10)}
        </p>
        <Link
          className="type-link"
          href={`/support/knowledge-base/${article.id}/edit`}
        >
          {supportPresentationCopy.editArticle}
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
    <DashboardLayout
      title={supportPresentationCopy.knowledgeBase}
      nav={[]}
      toolbar={toolbar}
    >
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
            <p className="text-xs">
              {supportPresentationCopy.updated}
              {article.updatedAt.slice(0, 10)}
            </p>
          </article>
        ))}
      </div>
      {!articles.length && <p>{supportPresentationCopy.noMatchingArticles}</p>}
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
    <DashboardLayout
      title={supportRemainingCopy.ticketTitle(ticket.number, ticket.subject)}
      nav={[]}
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title={supportPresentationCopy.conversation}>
          <p className="border-b border-border pb-5 whitespace-pre-wrap">
            {ticket.description ?? supportPresentationCopy.noOpeningDescription}
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
        <DashboardPanel title={supportPresentationCopy.triage}>
          <dl className="space-y-2">
            <dt>{supportPresentationCopy.requester}</dt>
            <dd>
              {ticket.requester?.displayName ??
                ticket.requester?.email ??
                supportPresentationCopy.unknown}
            </dd>
            <dt>{supportPresentationCopy.assignee}</dt>
            <dd>
              {ticket.assignee?.displayName ??
                supportPresentationCopy.unassigned}
            </dd>
            <dt>{supportPresentationCopy.priority}</dt>
            <dd>{ticket.priority}</dd>
            <dt>{supportPresentationCopy.status}</dt>
            <dd>{ticket.status}</dd>
            <dt>{supportPresentationCopy.resolutionDue}</dt>
            <dd>{ticket.resolutionDueAt ?? supportPresentationCopy.notSet}</dd>
          </dl>
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}
