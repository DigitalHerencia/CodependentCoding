import {
  getKnowledgeArticle,
  getKnowledgeArticles,
  getSupportInbox,
  getSupportMessages,
  getSupportTicket,
} from "@/lib/fetchers/supportFetchers";
import { notFound } from "next/navigation";
import "server-only";

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

export async function loadInboxWorkflow() {
  const tickets = await getSupportInbox();
  return { tickets };
}

export async function loadKnowledgeArticleEditWorkflow({
  articleId,
}: {
  articleId: string;
}) {
  const article = await getKnowledgeArticle(articleId);
  if (!article) notFound();
  return { article };
}

export async function loadKnowledgeArticleWorkflow({
  articleId,
}: {
  articleId: string;
}) {
  const article = await getKnowledgeArticle(articleId);
  if (!article) notFound();
  return { article };
}

export async function loadKnowledgeBaseWorkflow() {
  const articles = await getKnowledgeArticles();
  return { articles };
}

export async function loadSupportAnalyticsWorkflow() {
  const tickets = await getSupportInbox();
  const rows = ["LOW", "NORMAL", "HIGH", "URGENT"].map((priority) => {
    const group = tickets.filter((ticket) => ticket.priority === priority);
    return {
      id: priority,
      cells: {
        priority,
        count: group.length,
        unassigned: group.filter((ticket) => !ticket.assignee).length,
        waiting: group.filter(
          (ticket) => ticket.status === "WAITING_ON_CUSTOMER",
        ).length,
      },
    };
  });
  return { count: tickets.length, rows };
}

export async function loadTicketWorkflow({ ticketId }: { ticketId: string }) {
  const ticket = await getSupportTicket(ticketId);
  if (!ticket) notFound();
  const messages = await getSupportMessages(ticketId);
  return { ticket, messages };
}
