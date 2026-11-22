"use server";

import {
  createKnowledgeArticle,
  createSupportTicket,
  replyToSupportTicket,
  updateKnowledgeArticle,
  updateSupportTicketStatus,
} from "@/lib/actions/supportActions";
import { SUPPORT_STATUS_TRANSITIONS } from "@/lib/constants/supportConstants";
import {
  getKnowledgeArticle,
  getKnowledgeArticleForEdit,
  getKnowledgeArticlePage,
  getSupportAnalytics,
  getSupportCapabilities,
  getSupportInboxPage,
  getSupportMessagePage,
  getSupportTicket,
} from "@/lib/fetchers/supportFetchers";
import { toActionResult } from "@/lib/utils/actionResult";
import {
  supportArticleQuerySchema,
  supportInboxQuerySchema,
} from "@/schemas/supportSchemas";
import type { SupportSearchParams } from "@/types/supportTypes";
import { notFound } from "next/navigation";
import "server-only";

/** Load the reader's filtered, authorized active queue. */
export async function loadInboxWorkflow(input: SupportSearchParams) {
  return toActionResult(async () => {
    const criteria = supportInboxQuerySchema.parse({
      ...input,
      status: input.status === "" ? undefined : input.status,
      priority: input.priority === "" ? undefined : input.priority,
    });
    const [queue, capabilities] = await Promise.all([
      getSupportInboxPage(criteria),
      getSupportCapabilities(),
    ]);
    return {
      ...queue,
      criteria,
      canCreateTicket: capabilities.canCreateTicket,
    };
  });
}

/** Load the published knowledge index using server-side search. */
export async function loadKnowledgeBaseWorkflow(input: SupportSearchParams) {
  return toActionResult(async () => {
    const criteria = supportArticleQuerySchema.parse(input);
    const [page, capabilities] = await Promise.all([
      getKnowledgeArticlePage(criteria),
      getSupportCapabilities(),
    ]);
    return {
      ...page,
      criteria,
      canCreateArticle: capabilities.canCreateArticle,
    };
  });
}

/** Resolve a published article by its route identifier. */
export async function loadKnowledgeArticleWorkflow(articleId: string) {
  return toActionResult(async () => {
    const [article, capabilities] = await Promise.all([
      getKnowledgeArticle(articleId),
      getSupportCapabilities(),
    ]);
    if (!article) notFound();
    return { article, canEditArticle: capabilities.canEditArticle };
  });
}

/** Resolve an article through the editor projection. */
export async function loadKnowledgeArticleEditWorkflow(articleId: string) {
  return toActionResult(async () => {
    const article = await getKnowledgeArticleForEdit(articleId);
    if (!article) notFound();
    return article;
  });
}

/** Load available creation controls for the current membership. */
export async function loadSupportCapabilitiesWorkflow() {
  return toActionResult(() => getSupportCapabilities());
}

/** Load complete aggregates for the caller-visible active queue. */
export async function loadSupportAnalyticsWorkflow() {
  return toActionResult(getSupportAnalytics);
}

/** Load ticket detail and one page of the caller's visible conversation. */
export async function loadTicketWorkflow(
  ticketId: string,
  page: SupportSearchParams[string],
) {
  return toActionResult(async () => {
    const ticket = await getSupportTicket(ticketId);
    if (!ticket) notFound();
    const [conversation, capabilities] = await Promise.all([
      getSupportMessagePage(ticketId, page),
      getSupportCapabilities(ticketId),
    ]);
    const now = Date.now();
    const resolutionOverdue =
      ticket.status !== "RESOLVED" &&
      ticket.status !== "CLOSED" &&
      ticket.resolutionDueAt !== null &&
      Date.parse(ticket.resolutionDueAt) < now;
    return {
      ticket,
      ...conversation,
      canReply: capabilities.canReply,
      canUpdateStatus: capabilities.canUpdateStatus,
      statuses: SUPPORT_STATUS_TRANSITIONS[ticket.status],
      resolutionOverdue,
    };
  });
}

/** Submit a ticket creation command; numbering is server-owned. */
export async function createSupportTicketWorkflow(input: unknown) {
  return createSupportTicket(input);
}

/** Append a public reply under the authenticated author. */
export async function replyToSupportTicketWorkflow(input: unknown) {
  return replyToSupportTicket(input);
}

/** Apply a versioned ticket status change. */
export async function updateSupportTicketStatusWorkflow(input: unknown) {
  return updateSupportTicketStatus(input);
}

/** Publish a new knowledge article under the authenticated author. */
export async function createKnowledgeArticleWorkflow(input: unknown) {
  return createKnowledgeArticle(input);
}

/** Apply an article edit subject to its expected modification time. */
export async function updateKnowledgeArticleWorkflow(input: unknown) {
  return updateKnowledgeArticle(input);
}
