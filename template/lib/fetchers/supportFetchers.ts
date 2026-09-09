import "server-only";

import { assertPermission } from "../authz/permissions";
import {
  toKnowledgeArticleDTO,
  toSupportTicketDTO,
} from "../db/dto/support.dto";
import {
  knowledgeArticleSelect,
  supportTicketSelect,
} from "../db/selects/support.selects";
import { withAuthenticatedRead } from "../db/tenant";

export async function getSupportInbox(limit = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support:read");

    const rows = await tx.supportTicket.findMany({
      where: {
        organizationId: access.organizationId,
        ...(access.role === "CLIENT" ? { requesterUserId: access.userId } : {}),
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

export async function getSupportTicket(ticketId: string) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support:read");

    const record = await tx.supportTicket.findFirst({
      where: {
        id: ticketId,
        organizationId: access.organizationId,
        ...(access.role === "CLIENT" ? { requesterUserId: access.userId } : {}),
      },
      select: supportTicketSelect,
    });

    return record ? toSupportTicketDTO(record) : null;
  });
}

export async function getKnowledgeArticles(limit = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support:read");
    const rows = await tx.knowledgeArticle.findMany({
      where: { organizationId: access.organizationId, status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: knowledgeArticleSelect,
    });
    return rows.map(toKnowledgeArticleDTO);
  });
}

export async function getSupportMessages(ticketId: string) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support:read");
    const ticket = await tx.supportTicket.findFirst({
      where: {
        id: ticketId,
        organizationId: access.organizationId,
        ...(access.role === "CLIENT" ? { requesterUserId: access.userId } : {}),
      },
      select: { id: true },
    });
    if (!ticket) throw new Error("Ticket not found.");
    const messages = await tx.supportMessage.findMany({
      where: {
        ticketId,
        organizationId: access.organizationId,
        ...(access.role === "CLIENT" ? { isInternal: false } : {}),
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

export async function getKnowledgeArticle(articleId: string) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support:read");
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
