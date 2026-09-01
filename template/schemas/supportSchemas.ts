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
