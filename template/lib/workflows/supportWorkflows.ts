import { updateSupportTicketStatus } from "@/lib/actions/supportActions";
import {
  getKnowledgeArticle,
  getKnowledgeArticles,
  getSupportInbox,
  getSupportTicket,
} from "@/lib/fetchers/supportFetchers";
import type { SupportTicketTransitionCommand } from "@/types/supportTypes";

export async function resolveTicketWorkflow(
  input: SupportTicketTransitionCommand,
) {
  return updateSupportTicketStatus({ ...input, status: "RESOLVED" });
}

export async function reopenTicketWorkflow(
  input: SupportTicketTransitionCommand,
) {
  return updateSupportTicketStatus({ ...input, status: "OPEN" });
}

export async function getSupportWorkspaceWorkflow(limit = 100) {
  const [tickets, knowledgeArticles] = await Promise.all([
    getSupportInbox(limit),
    getKnowledgeArticles(limit),
  ]);
  return { tickets, knowledgeArticles };
}

export async function getSupportTicketWorkflow(ticketId: string) {
  return getSupportTicket(ticketId);
}

export async function getKnowledgeArticleWorkflow(articleId: string) {
  return getKnowledgeArticle(articleId);
}

export async function determineEscalationWorkflow(ticketId: string) {
  const ticket = await getSupportTicket(ticketId);
  if (!ticket) throw new Error("Support ticket was not found.");
  const dueAt = ticket.resolutionDueAt ?? ticket.firstResponseDueAt;
  const overdue = dueAt ? new Date(dueAt) < new Date() : false;
  return {
    ticketId: ticket.id,
    escalate: overdue || ticket.priority === "URGENT",
  };
}
