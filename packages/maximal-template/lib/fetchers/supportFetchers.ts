import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { persistedRecordIdSchema } from "@/schemas/commonSchemas";
import {
  supportArticleQuerySchema,
  supportInboxQuerySchema,
  supportPageSchema,
} from "@/schemas/supportSchemas";
import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import { limitedToCustomerRecords } from "@/lib/authz/attributes";
import {
  supportMessageReadScope,
  supportTicketReadScope,
} from "@/lib/authz/support";
import {
  toKnowledgeArticleDTO,
  toKnowledgeArticleListDTO,
  toSupportInboxTicketDTO,
  toSupportMessageDTO,
  toSupportTicketDTO,
} from "@/lib/db/dtos/supportDtos";
import {
  knowledgeArticleListSelect,
  knowledgeArticleSelect,
  supportInboxSelectForVisibility,
  supportMessageSelect,
  supportTicketSelectForVisibility,
} from "@/lib/db/selects/supportSelects";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import {
  SUPPORT_PAGE_SIZE,
  SUPPORT_PRIORITY_ORDER,
} from "@/lib/constants/supportConstants";
import type {
  SupportAnalyticsDTO,
  SupportCapabilities,
  SupportPageIdentityRecord,
} from "@/types/supportTypes";

/** Search ticket metadata in the authorized active queue with bounded navigable pages. */
export async function getSupportInboxPage(rawInput: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.ticket:read");
    const input = supportInboxQuerySchema.parse(rawInput);
    const scope = supportTicketReadScope(access);
    // strpos preserves literal substring and cross-field phrase searches, including ticket numbers.
    const matches = await tx.$queryRaw<SupportPageIdentityRecord[]>(Prisma.sql`
      SELECT ticket."id" FROM "SupportTicket" ticket
      LEFT JOIN "User" requester ON requester."id" = ticket."requesterUserId"
      WHERE ticket."organizationId" = ${scope.organizationId}::uuid
        AND ticket."status" <> 'CLOSED'
        ${scope.requesterUserId ? Prisma.sql`AND ticket."requesterUserId" = ${scope.requesterUserId}` : Prisma.empty}
        ${input.status ? Prisma.sql`AND ticket."status"::text = ${input.status}` : Prisma.empty}
        ${input.priority ? Prisma.sql`AND ticket."priority"::text = ${input.priority}` : Prisma.empty}
        AND strpos(lower(concat(ticket."number"::text, ' ', ticket."subject", ' ', coalesce(requester."displayName", ''))), lower(${input.query})) > 0
      ORDER BY CASE ticket."priority" WHEN 'URGENT' THEN 0 WHEN 'HIGH' THEN 1 WHEN 'NORMAL' THEN 2 WHEN 'LOW' THEN 3 END,
        ticket."createdAt" ASC, ticket."id" ASC
      LIMIT ${SUPPORT_PAGE_SIZE + 1} OFFSET ${(input.page - 1) * SUPPORT_PAGE_SIZE}
    `);
    const ids = matches.slice(0, SUPPORT_PAGE_SIZE).map((row) => row.id);
    const records = await tx.supportTicket.findMany({
      where: {
        ...scope,
        id: { in: ids },
        status: input.status ?? { not: "CLOSED" },
        ...(input.priority ? { priority: input.priority } : {}),
      },
      select: supportInboxSelectForVisibility(limitedToCustomerRecords(access)),
    });
    const byId = new Map(records.map((record) => [record.id, record]));
    const tickets = ids.flatMap((id) => {
      const record = byId.get(id);
      return record ? [toSupportInboxTicketDTO(record)] : [];
    });
    return {
      tickets,
      page: input.page,
      hasMore: matches.length > SUPPORT_PAGE_SIZE,
    };
  });
}

/** Direct lookup conceals foreign-tenant and foreign-requester ticket existence. */
export async function getSupportTicket(rawTicketId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.ticket:read");
    const id = persistedRecordIdSchema.parse(rawTicketId);
    const record = await tx.supportTicket.findFirst({
      where: { id, ...supportTicketReadScope(access) },
      select: supportTicketSelectForVisibility(
        limitedToCustomerRecords(access),
      ),
    });
    return record ? toSupportTicketDTO(record) : null;
  });
}

/** Published title/body substring search preserves phrase matching without serializing article bodies. */
export async function getKnowledgeArticlePage(rawInput: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.article:read");
    const input = supportArticleQuerySchema.parse(rawInput);
    const matches = await tx.$queryRaw<SupportPageIdentityRecord[]>(Prisma.sql`
      SELECT article."id" FROM "KnowledgeArticle" article
      WHERE article."organizationId" = ${access.organizationId}::uuid AND article."status" = 'PUBLISHED'
        AND strpos(lower(concat(article."title", ' ', article."body")), lower(${input.query})) > 0
      ORDER BY article."updatedAt" DESC, article."id" ASC
      LIMIT ${SUPPORT_PAGE_SIZE + 1} OFFSET ${(input.page - 1) * SUPPORT_PAGE_SIZE}
    `);
    const ids = matches.slice(0, SUPPORT_PAGE_SIZE).map((row) => row.id);
    const records = await tx.knowledgeArticle.findMany({
      where: {
        organizationId: access.organizationId,
        status: "PUBLISHED",
        id: { in: ids },
      },
      select: knowledgeArticleListSelect,
    });
    const byId = new Map(records.map((record) => [record.id, record]));
    const articles = ids.flatMap((id) => {
      const record = byId.get(id);
      return record ? [toKnowledgeArticleListDTO(record)] : [];
    });
    return {
      articles,
      page: input.page,
      hasMore: matches.length > SUPPORT_PAGE_SIZE,
    };
  });
}

/** Each conversation page revalidates ticket relationships before selecting visible rows. */
export async function getSupportMessagePage(
  rawTicketId: unknown,
  rawPage: unknown = 1,
) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.ticket:read");
    const ticketId = persistedRecordIdSchema.parse(rawTicketId);
    const page = supportPageSchema.parse(rawPage);
    const ticket = await tx.supportTicket.findFirst({
      where: { id: ticketId, ...supportTicketReadScope(access) },
      select: { id: true },
    });
    if (!ticket) throw new ResourceNotFoundError("Ticket");
    const rows = await tx.supportMessage.findMany({
      where: { ticketId, ...supportMessageReadScope(access) },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip: (page - 1) * SUPPORT_PAGE_SIZE,
      take: SUPPORT_PAGE_SIZE + 1,
      select: supportMessageSelect,
    });
    return {
      messages: rows.slice(0, SUPPORT_PAGE_SIZE).map(toSupportMessageDTO),
      page,
      hasMore: rows.length > SUPPORT_PAGE_SIZE,
    };
  });
}

/** Published detail remains authenticated and addressed by article identifier. */
export async function getKnowledgeArticle(rawArticleId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.article:read");
    const id = persistedRecordIdSchema.parse(rawArticleId);
    const record = await tx.knowledgeArticle.findFirst({
      where: { id, organizationId: access.organizationId, status: "PUBLISHED" },
      select: knowledgeArticleSelect,
    });
    return record ? toKnowledgeArticleDTO(record) : null;
  });
}

/** Editorial detail requires update permission independently of reader access. */
export async function getKnowledgeArticleForEdit(rawArticleId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.article:update");
    const id = persistedRecordIdSchema.parse(rawArticleId);
    const record = await tx.knowledgeArticle.findFirst({
      where: { id, organizationId: access.organizationId },
      select: knowledgeArticleSelect,
    });
    return record ? toKnowledgeArticleDTO(record) : null;
  });
}

/** Aggregate the complete caller-visible active queue under identical requester restrictions. */
export async function getSupportAnalytics(): Promise<SupportAnalyticsDTO> {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "support.ticket:read");
    const groups = await tx.supportTicket.groupBy({
      by: ["priority", "status", "assignedMembershipId"],
      where: { ...supportTicketReadScope(access), status: { not: "CLOSED" } },
      _count: { _all: true },
    });
    const rows = SUPPORT_PRIORITY_ORDER.map((priority) => {
      const matched = groups.filter((group) => group.priority === priority);
      return {
        id: priority,
        priority,
        count: matched.reduce((total, group) => total + group._count._all, 0),
        unassigned: matched
          .filter((group) => !group.assignedMembershipId)
          .reduce((total, group) => total + group._count._all, 0),
        waiting: matched
          .filter((group) => group.status === "WAITING_ON_CUSTOMER")
          .reduce((total, group) => total + group._count._all, 0),
      };
    });
    return { count: rows.reduce((total, row) => total + row.count, 0), rows };
  });
}

/** Server-resolved permissions and ticket relationships govern supported control visibility. */
export async function getSupportCapabilities(
  rawTicketId?: unknown,
): Promise<SupportCapabilities> {
  return withAuthenticatedRead(async (tx, access) => {
    let canWriteTicket = false;
    if (rawTicketId && hasPermission(access, "support.ticket:update")) {
      const id = persistedRecordIdSchema.parse(rawTicketId);
      const target = await tx.supportTicket.findFirst({
        where: { id, ...supportTicketReadScope(access) },
        select: {
          organizationId: true,
          requesterUserId: true,
          assignedMembershipId: true,
        },
      });
      if (target) {
        const { canManageOwnedOrAssignedResource } =
          await import("@/lib/authz/policies");
        canWriteTicket = canManageOwnedOrAssignedResource(access, {
          kind: "support.ticket",
          organizationId: target.organizationId,
          requesterUserId: target.requesterUserId,
          assigneeMembershipId: target.assignedMembershipId,
        });
      }
    }
    return {
      canCreateTicket: hasPermission(access, "support.ticket:create"),
      canReply: canWriteTicket,
      canUpdateStatus: canWriteTicket,
      canCreateArticle: hasPermission(access, "support.article:create"),
      canEditArticle: hasPermission(access, "support.article:update"),
    };
  });
}
