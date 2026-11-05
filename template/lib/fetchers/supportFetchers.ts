import {
  persistedReadLimitSchema,
  persistedRecordIdSchema,
} from "@/schema/commonSchemas";
import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { limitedToOwnRecords } from "@/lib/authz/policies";
import {
  toKnowledgeArticleDTO,
  toSupportTicketDTO,
} from "@/lib/db/dtos/supportDtos";
import {
  knowledgeArticleSelect,
  supportTicketSelect,
} from "@/lib/db/selects/supportSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getSupportInbox(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.ticket:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);

    const rows = await tx.supportTicket.findMany({
      where: {
        organizationId: access.organizationId,
        ...(limitedToOwnRecords(access)
          ? { requesterUserId: access.userId }
          : {}),
        status: {
          not: "CLOSED",
        },
      },
      orderBy: [
        {
          priority: "desc",
        },
        {
          createdAt: "asc",
        },
      ],
      take: Math.min(Math.max(limit, 1), 200),
      select: supportTicketSelect,
    });

    return rows.map(toSupportTicketDTO);
  });
}

export async function getSupportTicket(rawTicketId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.ticket:read");
    const ticketId = persistedRecordIdSchema.parse(rawTicketId);

    const record = await tx.supportTicket.findFirst({
      where: {
        id: ticketId,
        organizationId: access.organizationId,
        ...(limitedToOwnRecords(access)
          ? { requesterUserId: access.userId }
          : {}),
      },
      select: supportTicketSelect,
    });

    return record ? toSupportTicketDTO(record) : null;
  });
}

export async function getKnowledgeArticles(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.article:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);
    const rows = await tx.knowledgeArticle.findMany({
      where: { organizationId: access.organizationId, status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: knowledgeArticleSelect,
    });
    return rows.map(toKnowledgeArticleDTO);
  });
}

export async function getSupportMessages(rawTicketId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.ticket:read");
    const ticketId = persistedRecordIdSchema.parse(rawTicketId);
    const ticket = await tx.supportTicket.findFirst({
      where: {
        id: ticketId,
        organizationId: access.organizationId,
        ...(limitedToOwnRecords(access)
          ? { requesterUserId: access.userId }
          : {}),
      },
      select: { id: true },
    });
    if (!ticket) throw new Error("Ticket not found.");
    const messages = await tx.supportMessage.findMany({
      where: {
        ticketId,
        organizationId: access.organizationId,
        ...(limitedToOwnRecords(access) ? { isInternal: false } : {}),
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        authorLabel: true,
        body: true,
        isInternal: true,
        createdAt: true,
      },
    });
    return messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    }));
  });
}

export async function getKnowledgeArticle(rawArticleId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.article:read");
    const articleId = persistedRecordIdSchema.parse(rawArticleId);
    const row = await tx.knowledgeArticle.findFirst({
      where: {
        id: articleId,
        organizationId: access.organizationId,
        status: "PUBLISHED",
      },
      select: knowledgeArticleSelect,
    });
    return row ? toKnowledgeArticleDTO(row) : null;
  });
}
