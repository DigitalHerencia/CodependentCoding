import "server-only";

import type {
  KnowledgeArticleDTO,
  SupportTicketDTO,
  KnowledgeArticleRecord,
  SupportTicketRecord,
  KnowledgeArticleListRecord,
  KnowledgeArticleListDTO,
  SupportMessageRecord,
  SupportMessageDTO,
  SupportInboxTicketRecord,
  SupportInboxTicketDTO,
} from "@/types/supportTypes";

/** Serialize full article content after reader or editorial authorization. */
export function toKnowledgeArticleDTO(
  record: KnowledgeArticleRecord,
): KnowledgeArticleDTO {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    body: record.body,
    status: record.status,
    publishedAt: record.publishedAt?.toISOString() ?? null,
    updatedAt: record.updatedAt.toISOString(),
  };
}

/** Serialize only the inbox fields and its already-filtered conversation count. */
export function toSupportInboxTicketDTO(
  record: SupportInboxTicketRecord,
): SupportInboxTicketDTO {
  return {
    id: record.id,
    number: record.number,
    subject: record.subject,
    status: record.status,
    priority: record.priority,
    firstResponseDueAt: record.firstResponseDueAt?.toISOString() ?? null,
    requester: record.requester,
    assignee: record.assignee
      ? {
          membershipId: record.assignee.id,
          displayName: record.assignee.user.displayName,
        }
      : null,
    messageCount: record._count.messages,
  };
}

/** Serialize a ticket without widening its selected message-count projection. */
export function toSupportTicketDTO(
  record: SupportTicketRecord,
): SupportTicketDTO {
  return {
    id: record.id,
    number: record.number,
    subject: record.subject,
    description: record.description,
    status: record.status,
    priority: record.priority,
    firstResponseDueAt: record.firstResponseDueAt?.toISOString() ?? null,
    resolutionDueAt: record.resolutionDueAt?.toISOString() ?? null,
    resolvedAt: record.resolvedAt?.toISOString() ?? null,
    closedAt: record.closedAt?.toISOString() ?? null,
    version: record.version,
    requester: record.requester
      ? {
          id: record.requester.id,
          displayName: record.requester.displayName,
          email: record.requester.email,
        }
      : null,
    assignee: record.assignee
      ? {
          membershipId: record.assignee.id,
          displayName: record.assignee.user.displayName,
        }
      : null,
    messageCount: record._count.messages,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/** Serialize article discovery without transferring body content. */
export function toKnowledgeArticleListDTO(
  record: KnowledgeArticleListRecord,
): KnowledgeArticleListDTO {
  return {
    ...record,
    publishedAt: record.publishedAt?.toISOString() ?? null,
    updatedAt: record.updatedAt.toISOString(),
  };
}

/** Serialize only already-authorized message content. */
export function toSupportMessageDTO(
  record: SupportMessageRecord,
): SupportMessageDTO {
  return { ...record, createdAt: record.createdAt.toISOString() };
}
