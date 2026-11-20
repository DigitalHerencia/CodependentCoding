import "server-only";

import type {
  AudienceDTO,
  CampaignDTO,
  CampaignStepDTO,
  AudienceMutationDTO,
  CampaignMutationDTO,
} from "@/types/marketingTypes";
import type {
  AudienceRecord,
  CampaignRecord,
  CampaignStepRecord,
} from "@/types/marketingTypes";

/** Serialize the explicit audience contract and its concurrency timestamp. */
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

/** Serialize selected campaign planning fields without provider configuration. */
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
  return {
    id: record.id,
    type: record.type,
    position: record.position,
    templateKey:
      config &&
      typeof config === "object" &&
      !Array.isArray(config) &&
      typeof config.templateKey === "string"
        ? config.templateKey
        : null,
  };
}

/** A write result does not grant read access to an arbitrary persisted definition. */
export function toAudienceMutationDTO(record: {
  id: string;
  updatedAt: Date;
}): AudienceMutationDTO {
  return { id: record.id, updatedAt: record.updatedAt.toISOString() };
}

/** Return the new optimistic token without exposing the rest of a campaign to write-only callers. */
export function toCampaignMutationDTO(
  record: CampaignMutationDTO,
): CampaignMutationDTO {
  return { id: record.id, version: record.version };
}
