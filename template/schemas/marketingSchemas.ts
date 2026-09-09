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

export const updateCampaignSchema = createCampaignSchema.extend({
  campaignId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
});

export const audienceFormSchema = z.object({
  name: z.string().trim().min(1).max(200),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  definition: z.object({
    operator: z.literal("and"),
    rules: z
      .array(
        z.object({
          field: z.literal("status"),
          operator: z.literal("equals"),
          value: z.enum(["active", "lead", "inactive"]),
        }),
      )
      .length(1),
  }),
});
export const updateAudienceSchema = audienceFormSchema.extend({
  audienceId: z.string().uuid(),
  expectedUpdatedAt: z.coerce.date(),
});

export { CampaignStatus } from "@/generated/prisma/enums";
