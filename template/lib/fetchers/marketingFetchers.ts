import {
  persistedReadLimitSchema,
  persistedRecordIdSchema,
} from "@/schema/commonSchemas";
import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { toAudienceDTO, toCampaignDTO } from "@/lib/db/dtos/marketingDtos";
import {
  audienceSelect,
  campaignSelect,
} from "@/lib/db/selects/marketingSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getCampaigns(rawLimit: unknown = 50) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.campaign:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);

    const rows = await tx.campaign.findMany({
      where: {
        organizationId: access.organizationId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: Math.min(Math.max(limit, 1), 100),
      select: campaignSelect,
    });

    return rows.map(toCampaignDTO);
  });
}

export async function getAudiences(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.audience:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);
    const rows = await tx.audience.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { updatedAt: "desc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: audienceSelect,
    });
    return rows.map(toAudienceDTO);
  });
}

export async function getCampaign(rawCampaignId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.campaign:read");
    const campaignId = persistedRecordIdSchema.parse(rawCampaignId);
    const row = await tx.campaign.findFirst({
      where: { id: campaignId, organizationId: access.organizationId },
      select: campaignSelect,
    });
    return row ? toCampaignDTO(row) : null;
  });
}
export async function getAudience(rawAudienceId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.audience:read");
    const audienceId = persistedRecordIdSchema.parse(rawAudienceId);
    const row = await tx.audience.findFirst({
      where: { id: audienceId, organizationId: access.organizationId },
      select: audienceSelect,
    });
    return row ? toAudienceDTO(row) : null;
  });
}

export async function getCampaignSteps(rawCampaignId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.campaign:read");
    const campaignId = persistedRecordIdSchema.parse(rawCampaignId);
    const rows = await tx.campaignStep.findMany({
      where: { organizationId: access.organizationId, campaignId },
      orderBy: { position: "asc" },
      select: { id: true, type: true, position: true, config: true },
    });
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      position: row.position,
      templateKey:
        row.config &&
        typeof row.config === "object" &&
        "templateKey" in row.config &&
        typeof row.config.templateKey === "string"
          ? row.config.templateKey
          : null,
    }));
  });
}
