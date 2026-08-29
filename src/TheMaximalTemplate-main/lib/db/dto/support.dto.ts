import type {
  KnowledgeArticleDTO,
  SupportTicketDTO,
} from "../../../types/supportTypes";
import type {
  KnowledgeArticleRecord,
  SupportTicketRecord,
} from "../selects/support.selects";

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
