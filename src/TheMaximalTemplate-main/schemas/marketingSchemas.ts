import { z } from "zod";

export const createCampaignSchema = z.object({
  audienceId: z.string().uuid().nullable().optional(),
  name: z.string().trim().min(1).max(200),
  description: z.string().max(10_000).nullable().optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
});

export const updateCampaignStatusSchema = z.object({
  campaignId: z.string().uuid(),
  status: z.enum([
    "DRAFT",
    "SCHEDULED",
    "ACTIVE",
    "PAUSED",
    "COMPLETED",
    "CANCELED",
  ]),
  expectedVersion: z.number().int().positive(),
});
