import { z } from "zod";
import { CampaignStatus } from "@/generated/prisma/enums";

export const createCampaignSchema = z.object({
  audienceId: z.string().uuid().nullable().optional(),
  name: z.string().trim().min(1).max(200),
  description: z.string().max(10_000).nullable().optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
});

export const updateCampaignStatusSchema = z.object({
  campaignId: z.string().uuid(),
  status: z.enum(CampaignStatus),
  expectedVersion: z.number().int().positive(),
});
