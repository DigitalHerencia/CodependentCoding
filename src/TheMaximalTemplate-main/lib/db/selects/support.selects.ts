import type { Prisma } from "../../../generated/prisma/client";

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
      messages: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SupportTicketSelect;

export type SupportTicketRecord = Prisma.SupportTicketGetPayload<{
  select: typeof supportTicketSelect;
}>;

export const knowledgeArticleSelect = {
  id: true,
  slug: true,
  title: true,
  body: true,
  status: true,
  publishedAt: true,
  updatedAt: true,
} satisfies Prisma.KnowledgeArticleSelect;

export type KnowledgeArticleRecord = Prisma.KnowledgeArticleGetPayload<{
  select: typeof knowledgeArticleSelect;
}>;
