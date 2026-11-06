import {
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import {
  InboxToolbar,
  KnowledgeBaseToolbar,
} from "@/components/blocks/support-blocks";
import { Card } from "@/components/ui/card";
import { supportPresentationCopy } from "@/content/support";
import type {
  KnowledgeArticleDTO,
  SupportTicketDTO,
} from "@/types/supportTypes";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Why: Templates: pure presentation for the support pages, laid out from DTOs; data and slots come from features.

export function SupportAnalyticsContentBlock({
  count,
  rows,
}: {
  count: number;
  rows: {
    id: string;
    cells: {
      priority: string;
      count: number;
      unassigned: number;
      waiting: number;
    };
  }[];
}) {
  return (
    <>
      <p>
        {supportPresentationCopy.currentNonClosedQueueLimitedTo}
        {count}
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
          rows={rows}
        />
      </DashboardPanel>
    </>
  );
}

export function SupportInboxContentBlock({
  tickets,
}: {
  tickets: SupportTicketDTO[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof InboxToolbar>;
}) {
  return (
    <>
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
    </>
  );
}

export function SupportKnowledgeArticlePageBlock({
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

export function SupportKnowledgeBaseContentBlock({
  articles,
}: {
  articles: KnowledgeArticleDTO[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof KnowledgeBaseToolbar>;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Card key={article.id} className="space-y-3 p-5">
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
          </Card>
        ))}
      </div>
      {!articles.length && <p>{supportPresentationCopy.noMatchingArticles}</p>}
    </>
  );
}

export function SupportTicketContentBlock({
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
    <>
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
    </>
  );
}

export function SupportInboxToolbarBlock(
  props: ComponentProps<typeof SupportInboxContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <InboxToolbar {...toolbarProps} /> : toolbarSlot;
}
export function SupportKnowledgeBaseToolbarBlock(
  props: ComponentProps<typeof SupportKnowledgeBaseContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? (
    <KnowledgeBaseToolbar {...toolbarProps} />
  ) : (
    toolbarSlot
  );
}
