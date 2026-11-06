import type {
  KnowledgeArticleDTO,
  SupportTicketDTO,
} from "@/types/supportTypes";

export function selectInboxWorkflow(
  tickets: SupportTicketDTO[],
  query: string,
  status: string,
) {
  return tickets.filter(
    (ticket) =>
      (!status || ticket.status === status) &&
      `${ticket.number} ${ticket.subject} ${ticket.requester?.displayName ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
}

export function selectKnowledgeBaseWorkflow(
  articles: KnowledgeArticleDTO[],
  query: string,
) {
  return articles.filter((article) =>
    `${article.title} ${article.body}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
}
