export interface SupportTicketDTO {
  id: string;
  number: number;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  firstResponseDueAt: string | null;
  resolutionDueAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  version: number;
  requester: {
    id: string;
    displayName: string | null;
    email: string | null;
  } | null;
  assignee: { membershipId: string; displayName: string | null } | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}
export interface KnowledgeArticleDTO {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
}

export interface SupportTicketTransitionCommand {
  ticketId: string;
  expectedVersion: number;
}
