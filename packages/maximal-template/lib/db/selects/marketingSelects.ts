import "server-only";

import type { Prisma } from "@/generated/prisma/client";

export const campaignSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  scheduledAt: true,
  startedAt: true,
  completedAt: true,
  canceledAt: true,
  version: true,
  audience: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      steps: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CampaignSelect;

export type CampaignRecord = Prisma.CampaignGetPayload<{
  select: typeof campaignSelect;
}>;

export const audienceSelect = {
  definition: true,
  id: true,
  name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AudienceSelect;

export type AudienceRecord = Prisma.AudienceGetPayload<{
  select: typeof audienceSelect;
}>;

/** Configuration is narrowed by the DTO before leaving the server. */
export const campaignStepSelect = { id: true, type: true, position: true, config: true } satisfies Prisma.CampaignStepSelect;
export type CampaignStepRecord = Prisma.CampaignStepGetPayload<{ select: typeof campaignStepSelect }>;
