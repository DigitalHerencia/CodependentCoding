import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/** Minimal persisted campaign planning fields; RLS covers nested tenant relations. */
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

/** Persisted audience metadata and structured definition, without inferred membership counts. */
export const audienceSelect = {
  definition: true,
  id: true,
  name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AudienceSelect;

/** Configuration is narrowed by the DTO before leaving the server. */
export const campaignStepSelect = {
  id: true,
  type: true,
  position: true,
  config: true,
} satisfies Prisma.CampaignStepSelect;
