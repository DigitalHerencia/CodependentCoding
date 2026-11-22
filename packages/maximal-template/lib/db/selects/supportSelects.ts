import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/** Minimal ticket projection whose default count excludes confidential notes. */
export const supportTicketSelect = {
  id: true,
  number: true,
  subject: true,
  description: true,
  status: true,
  priority: true,
  firstResponseDueAt: true,
  resolutionDueAt: true,
  resolvedAt: true,
  closedAt: true,
  version: true,
  requester: {
    select: {
      id: true,
      displayName: true,
      email: true,
    },
  },
  assignee: {
    select: {
      id: true,
      user: {
        select: {
          displayName: true,
        },
      },
    },
  },
  _count: {
    select: {
      messages: { where: { isInternal: false } },
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SupportTicketSelect;

/** Staff may count the complete conversation after the caller's policy is established. */
export function supportTicketSelectForVisibility(customer: boolean) {
  return {
    ...supportTicketSelect,
    _count: {
      select: { messages: { where: customer ? { isInternal: false } : {} } },
    },
  } satisfies Prisma.SupportTicketSelect;
}

/** Inbox fields omit detail-only descriptions, versions, and lifecycle timestamps. */
export const supportInboxTicketSelect = {
  id: true,
  number: true,
  subject: true,
  status: true,
  priority: true,
  firstResponseDueAt: true,
  requester: supportTicketSelect.requester,
  assignee: supportTicketSelect.assignee,
  _count: supportTicketSelect._count,
} satisfies Prisma.SupportTicketSelect;

/** Inbox counts use the same internal-note visibility predicate as conversation reads. */
export function supportInboxSelectForVisibility(customer: boolean) {
  return {
    ...supportInboxTicketSelect,
    _count: supportTicketSelectForVisibility(customer)._count,
  };
}

/** Full article content for a direct reader or editor detail lookup. */
export const knowledgeArticleSelect = {
  id: true,
  slug: true,
  title: true,
  body: true,
  status: true,
  publishedAt: true,
  updatedAt: true,
} satisfies Prisma.KnowledgeArticleSelect;

/** Discovery never transfers article bodies solely for list filtering. */
export const knowledgeArticleListSelect = {
  id: true,
  slug: true,
  title: true,
  status: true,
  publishedAt: true,
  updatedAt: true,
} satisfies Prisma.KnowledgeArticleSelect;

/** Message content is selected only after ticket and visibility predicates are applied. */
export const supportMessageSelect = {
  id: true,
  authorLabel: true,
  body: true,
  isInternal: true,
  createdAt: true,
} satisfies Prisma.SupportMessageSelect;
