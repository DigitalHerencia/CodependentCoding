import "server-only";

import { assertPermission } from "../authz/permissions";
import { toAudienceDTO, toCampaignDTO } from "../db/dto/marketing.dto";
import {
  audienceSelect,
  campaignSelect,
} from "../db/selects/marketing.selects";
import { withAuthenticatedRead } from "../db/tenant";

export async function getCampaigns(limit = 50) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing:read");

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

export async function getAudiences(limit = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing:read");
    const rows = await tx.audience.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { updatedAt: "desc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: audienceSelect,
    });
    return rows.map(toAudienceDTO);
  });
}

export async function getCampaign(campaignId: string) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing:read");
    const row = await tx.campaign.findFirst({
      where: { id: campaignId, organizationId: access.organizationId },
      select: campaignSelect,
    });
    return row ? toCampaignDTO(row) : null;
  });
}
export async function getAudience(audienceId: string) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing:read");
    const row = await tx.audience.findFirst({
      where: { id: audienceId, organizationId: access.organizationId },
      select: audienceSelect,
    });
    return row ? toAudienceDTO(row) : null;
  });
}

export async function getCampaignSteps(campaignId: string) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing:read");
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
