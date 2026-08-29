import { z } from "zod";

export const createSupportTicketSchema = z.object({
  subject: z.string().trim().min(1).max(300),
  description: z.string().max(30_000).nullable().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});

export const updateSupportTicketStatusSchema = z.object({
  ticketId: z.string().uuid(),
  status: z.enum([
    "OPEN",
    "IN_PROGRESS",
    "WAITING_ON_CUSTOMER",
    "WAITING_ON_INTERNAL",
    "RESOLVED",
    "CLOSED",
  ]),
  expectedVersion: z.number().int().positive(),
});
