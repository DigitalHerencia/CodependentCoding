import type { TicketStatus, TicketPriority } from "@/generated/prisma/enums";
export type SupportTicketDTO = {
  id: string;
  number: number;
  subject: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
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
};
export type KnowledgeArticleDTO = {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
};
