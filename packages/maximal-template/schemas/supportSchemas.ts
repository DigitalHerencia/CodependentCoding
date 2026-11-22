import { z } from "zod";
import { TicketPriority, TicketStatus } from "@/generated/prisma/enums";

/** Supported ticket fields, with server-owned requester and number excluded. */
export const createSupportTicketSchema = z.object({
  subject: z.string().trim().min(1).max(300),
  description: z.string().max(30_000).nullable().optional(),
  priority: z.enum(TicketPriority).default("NORMAL"),
});

/** Versioned lifecycle command addressed by persistence identifier. */
export const updateSupportTicketStatusSchema = z.object({
  ticketId: z.string().uuid(),
  status: z.enum(TicketStatus),
  expectedVersion: z.number().int().positive(),
});

/** Public append command with trusted author and visibility resolved server-side. */
export const supportReplySchema = z.object({
  ticketId: z.string().uuid(),
  body: z.string().trim().min(1).max(30000),
});
/** Existing supported publication fields rendered as plain text. */
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
/** Editorial update detects concurrent changes to a tenant-scoped article. */
export const updateKnowledgeArticleSchema = knowledgeArticleFormSchema.extend({
  articleId: z.string().uuid(),
  expectedUpdatedAt: z.coerce.date(),
});

/** Bounded route page indexes reject arbitrary unbounded offsets. */
export const supportPageSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(Number.MAX_SAFE_INTEGER / 50)
  .default(1);
/** Inbox filtering covers ticket metadata without searching hidden conversation content. */
export const supportInboxQuerySchema = z.object({
  query: z.string().trim().max(300).default(""),
  status: z.enum(TicketStatus).optional(),
  priority: z.enum(TicketPriority).optional(),
  page: supportPageSchema,
});
/** Reader discovery searches published article titles and slugs. */
export const supportArticleQuerySchema = z.object({
  query: z.string().trim().max(300).default(""),
  page: supportPageSchema,
});

export { TicketStatus, TicketPriority } from "@/generated/prisma/enums";
