import type { Prisma } from "@/generated/prisma/client";

import {
  knowledgeArticleSelect,
  supportTicketSelect,
} from "../selects/support.selects";
import { ConcurrencyConflictError, ResourceNotFoundError } from "./errors";

export async function lockSupportTicketNumberTx(
  tx: Prisma.TransactionClient,
  organizationId: string,
) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${organizationId}))`;
}

export async function assignSupportTicketTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    ticketId: string;
    assigneeMembershipId: string;
    expectedVersion: number;
  },
) {
  const assignee = await tx.membership.findFirst({
    where: {
      id: input.assigneeMembershipId,
      organizationId: input.organizationId,
      status: "ACTIVE",
    },
    select: { id: true },
  });
  if (!assignee) throw new ResourceNotFoundError("Support assignee");
  const result = await tx.supportTicket.updateMany({
    where: {
      id: input.ticketId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
    },
    data: {
      assigneeMembershipId: assignee.id,
      status: "IN_PROGRESS",
      version: { increment: 1 },
    },
  });
  if (result.count !== 1) throw new ConcurrencyConflictError("Support ticket");
  return tx.supportTicket.findFirstOrThrow({
    where: { id: input.ticketId, organizationId: input.organizationId },
    select: supportTicketSelect,
  });
}

export async function publishKnowledgeArticleTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    authorMembershipId: string;
    articleId?: string;
    slug: string;
    title: string;
    body: string;
  },
) {
  if (input.articleId) {
    const result = await tx.knowledgeArticle.updateMany({
      where: { id: input.articleId, organizationId: input.organizationId },
      data: {
        slug: input.slug,
        title: input.title,
        body: input.body,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    if (result.count !== 1)
      throw new ResourceNotFoundError("Knowledge article");
    return tx.knowledgeArticle.findFirstOrThrow({
      where: { id: input.articleId, organizationId: input.organizationId },
      select: knowledgeArticleSelect,
    });
  }
  return tx.knowledgeArticle.create({
    data: {
      organizationId: input.organizationId,
      authorMembershipId: input.authorMembershipId,
      slug: input.slug,
      title: input.title,
      body: input.body,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    select: knowledgeArticleSelect,
  });
}
