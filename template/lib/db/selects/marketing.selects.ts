import type { Prisma } from "../../../generated/prisma/client";

export const campaignSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  scheduledAt: true,
  startedAt: true,
  completedAt: true,
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
  id: true,
  name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AudienceSelect;

export type AudienceRecord = Prisma.AudienceGetPayload<{
  select: typeof audienceSelect;
}>;
