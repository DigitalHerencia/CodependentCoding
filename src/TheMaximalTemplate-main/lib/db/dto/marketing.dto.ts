import type { AudienceDTO, CampaignDTO } from "../../../types/marketingTypes";
import type {
  AudienceRecord,
  CampaignRecord,
} from "../selects/marketing.selects";

export function toAudienceDTO(record: AudienceRecord): AudienceDTO {
  return {
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
