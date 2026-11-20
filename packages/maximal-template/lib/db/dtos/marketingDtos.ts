import "server-only";

import type { AudienceDTO, CampaignDTO, CampaignStepDTO } from "@/types/marketingTypes";
import type {
  AudienceRecord,
  CampaignRecord,
  CampaignStepRecord,
} from "@/lib/db/selects/marketingSelects";

export function toAudienceDTO(record: AudienceRecord): AudienceDTO {
  return {
    definition: record.definition,
    id: record.id,
    name: record.name,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function toCampaignDTO(record: CampaignRecord): CampaignDTO {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    status: record.status,
    scheduledAt: record.scheduledAt?.toISOString() ?? null,
    startedAt: record.startedAt?.toISOString() ?? null,
    completedAt: record.completedAt?.toISOString() ?? null,
    canceledAt: record.canceledAt?.toISOString() ?? null,
    version: record.version,
    audience: record.audience
      ? {
          id: record.audience.id,
          name: record.audience.name,
        }
      : null,
    stepCount: record._count.steps,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/** Exclude arbitrary provider configuration and recipient data from presentation. */
export function toCampaignStepDTO(record: CampaignStepRecord): CampaignStepDTO {
  const config = record.config;
  return { id: record.id, type: record.type, position: record.position,
    templateKey: config && typeof config === "object" && !Array.isArray(config) && typeof config.templateKey === "string" ? config.templateKey : null,
  };
}
