import "server-only";

import {
  getKnowledgeArticles,
  getSupportInbox,
  getSupportTicket,
} from "@/lib/fetchers/supportFetchers";

export async function getSupportWorkspaceWorkflow(limit = 100) {
  const [tickets, knowledgeArticles] = await Promise.all([
    getSupportInbox(limit),
    getKnowledgeArticles(limit),
  ]);
  return { tickets, knowledgeArticles };
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
