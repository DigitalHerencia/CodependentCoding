import { z } from "zod";
import { TicketPriority, TicketStatus } from "@/generated/prisma/enums";

export const createSupportTicketSchema = z.object({
  subject: z.string().trim().min(1).max(300),
  description: z.string().max(30_000).nullable().optional(),
  priority: z.enum(TicketPriority).default("NORMAL"),
});

export const updateSupportTicketStatusSchema = z.object({
  ticketId: z.string().uuid(),
  status: z.enum(TicketStatus),
  expectedVersion: z.number().int().positive(),
});

export const supportReplySchema = z.object({
  ticketId: z.string().uuid(),
  body: z.string().trim().min(1).max(30000),
});
export const knowledgeArticleFormSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body: z.string().trim().min(1).max(100000),
});
export const updateKnowledgeArticleSchema = knowledgeArticleFormSchema.extend({
  articleId: z.string().uuid(),
  expectedUpdatedAt: z.coerce.date(),
});

export { TicketStatus, TicketPriority } from "@/generated/prisma/enums";
