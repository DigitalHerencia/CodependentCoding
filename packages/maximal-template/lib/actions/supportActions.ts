"use server";

import { z } from "zod";
import {
  supportReplySchema,
  knowledgeArticleFormSchema,
  updateKnowledgeArticleSchema,
  createSupportTicketSchema,
  updateSupportTicketStatusSchema,
} from "@/schemas/supportSchemas";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { authorizeOwnedOrAssignedWrite } from "@/lib/authz/policies";
import {
  assertCustomerRequester,
  limitedToCustomerRecords,
} from "@/lib/authz/attributes";
import { supportTicketReadScope } from "@/lib/authz/support";
import {
  toKnowledgeArticleDTO,
  toSupportTicketDTO,
} from "@/lib/db/dtos/supportDtos";
import { knowledgeArticleSelect } from "@/lib/db/selects/supportSelects";
import {
  appendSupportReplyTx,
  createSupportTicketTx,
  updateTicketStatusTx,
} from "@/lib/db/selects/supportTx";
import { withTenantTransaction } from "@/lib/db/tenancy";
import {
  ConcurrencyConflictError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";
import { invalidatePaths } from "@/lib/cache/invalidate";
import { toActionResult } from "@/lib/utils/actionResult";

/** Refresh queue, aggregate, detail, and module dashboard data only after committed ticket changes. */
function invalidateTicketViews(ticketId: string) {
  invalidatePaths([
    "/support/inbox",
    "/support/analytics",
    `/support/tickets/${ticketId}`,
    "/dashboard",
  ]);
}

/** Refresh reader and editor projections after a committed article change. */
function invalidateArticleViews(articleId: string) {
  invalidatePaths([
    "/support/knowledge-base",
    `/support/knowledge-base/${articleId}`,
    `/support/knowledge-base/${articleId}/edit`,
  ]);
}

/** Turn the organization-slug uniqueness constraint into a recoverable field error. */
function articleWriteError(cause: unknown): never {
  if ((cause as { code?: string } | null)?.code === "P2002") {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["slug"],
        message:
          "This slug is already used by an article in this organization.",
      },
    ]);
  }
  throw cause;
}

/** Create a ticket with a server-derived requester and serialized tenant-scoped number. */
export async function createSupportTicket(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "support.ticket:create");
      const input = createSupportTicketSchema.parse(rawInput);
      return toSupportTicketDTO(
        await createSupportTicketTx(tx, {
          ...input,
          organizationId: access.organizationId,
          requesterUserId: access.userId,
        }),
      );
    });
    invalidateTicketViews(saved.id);
    return saved;
  });
}

/** Authorize the concrete requester/assignee relationship before a versioned lifecycle mutation. */
export async function updateSupportTicketStatus(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "support.ticket:update");
      const input = updateSupportTicketStatusSchema.parse(rawInput);
      const target = await tx.supportTicket.findFirst({
        where: { id: input.ticketId, ...supportTicketReadScope(access) },
        select: {
          organizationId: true,
          requesterUserId: true,
          assignedMembershipId: true,
        },
      });
      if (!target) throw new ResourceNotFoundError("Support ticket");
      assertCustomerRequester(access, target);
      authorizeOwnedOrAssignedWrite(access, "support.ticket:update", {
        kind: "support.ticket",
        organizationId: target.organizationId,
        requesterUserId: target.requesterUserId,
        assigneeMembershipId: target.assignedMembershipId,
      });
      return toSupportTicketDTO(
        await updateTicketStatusTx(
          tx,
          { ...input, organizationId: access.organizationId },
          limitedToCustomerRecords(access),
        ),
      );
    });
    invalidateTicketViews(saved.id);
    return saved;
  });
}

/** Append only a public reply with trusted author attribution and atomic parent activity updates. */
export async function replyToSupportTicket(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "support.ticket:update");
      const input = supportReplySchema.parse(rawInput);
      const target = await tx.supportTicket.findFirst({
        where: { id: input.ticketId, ...supportTicketReadScope(access) },
        select: {
          organizationId: true,
          requesterUserId: true,
          assignedMembershipId: true,
        },
      });
      if (!target) throw new ResourceNotFoundError("Ticket");
      assertCustomerRequester(access, target);
      authorizeOwnedOrAssignedWrite(access, "support.ticket:update", {
        kind: "support.ticket",
        organizationId: target.organizationId,
        requesterUserId: target.requesterUserId,
        assigneeMembershipId: target.assignedMembershipId,
      });
      const author = await tx.user.findUniqueOrThrow({
        where: { id: access.userId },
        select: { displayName: true },
      });
      await appendSupportReplyTx(tx, {
        ...input,
        organizationId: access.organizationId,
        authorMembershipId: access.membershipId,
        authorLabel:
          author.displayName ??
          (limitedToCustomerRecords(access) ? "Requester" : "Team member"),
      });
      return { saved: true, ticketId: input.ticketId };
    });
    invalidateTicketViews(saved.ticketId);
    return { saved: saved.saved };
  });
}

/** Retain existing immediate publication with tenant-owned slug uniqueness and trusted authorship. */
export async function createKnowledgeArticle(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "support.article:create");
      const input = knowledgeArticleFormSchema.parse(rawInput);
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
    }).catch(articleWriteError);
    invalidateArticleViews(saved.id);
    return saved;
  });
}

/** Update supported editorial fields while distinguishing inaccessible records, duplicate slugs, and stale edits. */
export async function updateKnowledgeArticle(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "support.article:update");
      const input = updateKnowledgeArticleSchema.parse(rawInput);
      const target = await tx.knowledgeArticle.findFirst({
        where: { id: input.articleId, organizationId: access.organizationId },
        select: { id: true },
      });
      if (!target) throw new ResourceNotFoundError("Knowledge article");
      const result = await tx.knowledgeArticle.updateMany({
        where: {
          id: target.id,
          organizationId: access.organizationId,
          updatedAt: input.expectedUpdatedAt,
        },
        data: { title: input.title, slug: input.slug, body: input.body },
      });
      if (result.count !== 1)
        throw new ConcurrencyConflictError("Knowledge article");
      return toKnowledgeArticleDTO(
        await tx.knowledgeArticle.findFirstOrThrow({
          where: { id: target.id, organizationId: access.organizationId },
          select: knowledgeArticleSelect,
        }),
      );
    }).catch(articleWriteError);
    invalidateArticleViews(saved.id);
    return saved;
  });
}
