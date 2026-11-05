import type { CampaignStatus, AudienceStatus } from "@/generated/prisma/enums";
export type CampaignDTO = {
  id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  version: number;
  audience: { id: string; name: string } | null;
  stepCount: number;
  createdAt: string;
  updatedAt: string;
};
export type AudienceDTO = {
  definition: unknown;
  id: string;
  name: string;
  status: AudienceStatus;
  createdAt: string;
  updatedAt: string;
};
