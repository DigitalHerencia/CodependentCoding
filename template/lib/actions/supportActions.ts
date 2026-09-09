"use server";

import {
  supportReplySchema,
  knowledgeArticleFormSchema,
  updateKnowledgeArticleSchema,
  createSupportTicketSchema,
  updateSupportTicketStatusSchema,
} from "@/schemas/supportSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { authorizeOwnedOrAssignedWrite } from "@/lib/authz/policies";
import {
  toKnowledgeArticleDTO,
  toSupportTicketDTO,
} from "@/lib/db/dto/support.dto";
import {
  knowledgeArticleSelect,
  supportTicketSelect,
} from "@/lib/db/selects/support.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { updateTicketStatusTx } from "@/lib/db/transactions/update-ticket-status.tx";
import { lockSupportTicketNumberTx } from "@/lib/db/transactions/support.tx";

export async function createSupportTicket(rawInput: unknown) {
  const input = createSupportTicketSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "support:write");
    await lockSupportTicketNumberTx(tx, access.organizationId);
    const latest = await tx.supportTicket.aggregate({
      where: { organizationId: access.organizationId },
      _max: { number: true },
    });
    const record = await tx.supportTicket.create({
      data: {
        organizationId: access.organizationId,
        requesterUserId: access.userId,
        number: (latest._max.number ?? 0) + 1,
        subject: input.subject,
        description: input.description ?? null,
        priority: input.priority,
      },
      select: supportTicketSelect,
    });
    return toSupportTicketDTO(record);
  });
}

export async function updateSupportTicketStatus(rawInput: unknown) {
  const input = updateSupportTicketStatusSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    const target = await tx.supportTicket.findFirst({
      where: { id: input.ticketId, organizationId: access.organizationId },
      select: {
        organizationId: true,
        requesterUserId: true,
        assignedMembershipId: true,
      },
    });
    if (!target) throw new Error("Support ticket was not found.");

    authorizeOwnedOrAssignedWrite(access, "support:write", {
      kind: "support-ticket",
      organizationId: target.organizationId,
      requesterUserId: target.requesterUserId,
      assigneeMembershipId: target.assignedMembershipId,
    });

    const record = await updateTicketStatusTx(tx, {
      organizationId: access.organizationId,
      ticketId: input.ticketId,
      status: input.status,
      expectedVersion: input.expectedVersion,
    });
    return toSupportTicketDTO(record);
  });
}

export async function replyToSupportTicket(rawInput: unknown) {
  const input = supportReplySchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    const target = await tx.supportTicket.findFirst({
      where: { id: input.ticketId, organizationId: access.organizationId },
      select: {
        organizationId: true,
        requesterUserId: true,
        assignedMembershipId: true,
      },
    });
    if (!target) throw new Error("Ticket not found.");
    authorizeOwnedOrAssignedWrite(access, "support:write", {
      kind: "support-ticket",
      organizationId: target.organizationId,
      requesterUserId: target.requesterUserId,
      assigneeMembershipId: target.assignedMembershipId,
    });
    const author = await tx.user.findUniqueOrThrow({
      where: { id: access.userId },
      select: { displayName: true },
    });
    await tx.supportMessage.create({
      data: {
        organizationId: access.organizationId,
        ticketId: input.ticketId,
        authorMembershipId: access.membershipId,
        authorLabel: author.displayName ?? "Team member",
        body: input.body,
        isInternal: false,
      },
    });
    return { saved: true };
  });
}
export async function createKnowledgeArticle(rawInput: unknown) {
  const input = knowledgeArticleFormSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "support:write");
    if (access.role === "CLIENT")
      throw new Error("Article authoring requires a team membership.");
    return toKnowledgeArticleDTO(
      await tx.knowledgeArticle.create({
        data: {
          ...input,
          organizationId: access.organizationId,
          authorMembershipId: access.membershipId,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
        select: knowledgeArticleSelect,
      }),
    );
  });
}
export async function updateKnowledgeArticle(rawInput: unknown) {
  const input = updateKnowledgeArticleSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "support:write");
    if (access.role === "CLIENT")
      throw new Error("Article authoring requires a team membership.");
    const result = await tx.knowledgeArticle.updateMany({
      where: {
        id: input.articleId,
        organizationId: access.organizationId,
        updatedAt: input.expectedUpdatedAt,
      },
      data: { title: input.title, slug: input.slug, body: input.body },
    });
    if (result.count !== 1)
      throw new Error("Article changed. Reload before editing.");
    return toKnowledgeArticleDTO(
      await tx.knowledgeArticle.findFirstOrThrow({
        where: { id: input.articleId, organizationId: access.organizationId },
        select: knowledgeArticleSelect,
      }),
    );
  });
}
