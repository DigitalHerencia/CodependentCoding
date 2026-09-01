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
