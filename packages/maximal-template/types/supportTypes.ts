import type { FormEventHandler, ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { TicketStatus, TicketPriority } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import type {
  supportTicketSelect,
  supportInboxTicketSelect,
  knowledgeArticleSelect,
  knowledgeArticleListSelect,
  supportMessageSelect,
} from "@/lib/db/selects/supportSelects";
/** Persisted ticket shape used only through explicit DTO serialization. */
export type SupportTicketRecord = Prisma.SupportTicketGetPayload<{
  select: typeof supportTicketSelect;
}>;
/** Minimal persistence projection for authorized inbox rows. */
export type SupportInboxTicketRecord = Prisma.SupportTicketGetPayload<{
  select: typeof supportInboxTicketSelect;
}>;
/** Inbox navigation and triage data without detail-only fields. */
export type SupportInboxTicketDTO = Pick<
  SupportTicketDTO,
  | "id"
  | "number"
  | "subject"
  | "status"
  | "priority"
  | "firstResponseDueAt"
  | "requester"
  | "assignee"
  | "messageCount"
>;
/** Persisted editorial detail shape. */
export type KnowledgeArticleRecord = Prisma.KnowledgeArticleGetPayload<{
  select: typeof knowledgeArticleSelect;
}>;
/** Persisted article discovery shape omitting body content. */
export type KnowledgeArticleListRecord = Prisma.KnowledgeArticleGetPayload<{
  select: typeof knowledgeArticleListSelect;
}>;
/** Persisted message shape after the caller's visibility filter. */
export type SupportMessageRecord = Prisma.SupportMessageGetPayload<{
  select: typeof supportMessageSelect;
}>;
/** Authorized, serializable ticket projection with a visibility-relative message count. */
export type SupportTicketDTO = {
  id: string;
  number: number;
  subject: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  firstResponseDueAt: string | null;
  resolutionDueAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  version: number;
  requester: {
    id: string;
    displayName: string | null;
    email: string | null;
  } | null;
  assignee: { membershipId: string; displayName: string | null } | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
};
/** Organization-scoped article detail addressed by its persistence identifier. */
export type KnowledgeArticleDTO = {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
};
/** Bounded discovery row that does not expose the article body. */
export type KnowledgeArticleListDTO = Omit<KnowledgeArticleDTO, "body">;
/** One saved visible conversation entry, ordered by creation time and identifier. */
export type SupportMessageDTO = Omit<SupportMessageRecord, "createdAt"> & {
  createdAt: string;
};
/** Complete active-queue aggregate within the caller's authorized ticket population. */
export type SupportAnalyticsDTO = {
  count: number;
  rows: {
    id: TicketPriority;
    priority: TicketPriority;
    count: number;
    unassigned: number;
    waiting: number;
  }[];
};
/** Permission and relationship decisions resolved by the server for supported controls. */
export type SupportCapabilities = {
  canCreateTicket: boolean;
  canReply: boolean;
  canUpdateStatus: boolean;
  canCreateArticle: boolean;
  canEditArticle: boolean;
};
/** Versioned status command after tenant and relationship authorization. */
export type SupportStatusTxInput = {
  organizationId: string;
  ticketId: string;
  status: TicketStatus;
  expectedVersion: number;
};
/** Server-owned ticket allocation fields and supported requester content. */
export type SupportCreateTxInput = {
  organizationId: string;
  requesterUserId: string;
  subject: string;
  description?: string | null | undefined;
  priority: TicketPriority;
};
/** Trusted public conversation append fields. */
export type SupportReplyTxInput = {
  organizationId: string;
  ticketId: string;
  authorMembershipId: string;
  authorLabel: string;
  body: string;
};
/** Bounded ordered identifier projection used by parameterized support search queries. */
export type SupportPageIdentityRecord = { id: string };

/** Route variants used for support headings and loading states. */
export type SupportPageKind =
  | "inbox"
  | "newTicket"
  | "ticket"
  | "knowledge"
  | "newArticle"
  | "article"
  | "editArticle"
  | "analytics";

/** Links for adjacent pages of the current authorized projection. */
export type SupportPager = { previous?: string; next?: string };

/** Active queue results and the filter state that produced them. */
export type SupportInboxView = {
  tickets: SupportInboxTicketDTO[];
  query?: string;
  status?: string | undefined;
  priority?: TicketPriority | undefined;
  canCreateTicket: boolean;
};

/** Published reader list carrying only fields used by the index. */
export type SupportKnowledgeView = {
  articles: KnowledgeArticleListDTO[];
  query?: string;
  canCreateArticle: boolean;
};

/** Published article content and editorial navigation permission. */
export type SupportArticleView = {
  article: KnowledgeArticleDTO;
  canEditArticle: boolean;
};

/** Ticket metadata and one prefiltered page of conversation messages. */
export type SupportConversationView = {
  ticket: SupportTicketDTO;
  messages: SupportMessageDTO[];
  pager: SupportPager;
  children: ReactNode;
  resolutionOverdue: boolean;
};

/** Aggregated counts by triage priority for the authorized active queue. */
export type SupportAnalyticsView = SupportAnalyticsDTO;

/** Field registration and validation state supplied by a support RHF form. */
export type SupportFieldBinding = {
  name:
    | "subject"
    | "description"
    | "priority"
    | "status"
    | "reply"
    | "title"
    | "slug"
    | "article";
  registration: UseFormRegisterReturn;
  error: string | undefined;
  multiline?: number;
  options?: readonly string[];
};

/** Presentation contract for a support form; execution stays with the form owner. */
export type SupportFormView = {
  kind: "newTicket" | "reply" | "status" | "newArticle" | "editArticle";
  fields: SupportFieldBinding[];
  pending: boolean;
  saved: boolean;
  error: string | undefined;
  transportFailed: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

/** Raw Next.js search parameters parsed by support workflow contracts. */
export type SupportSearchParams = Record<string, string | string[] | undefined>;
