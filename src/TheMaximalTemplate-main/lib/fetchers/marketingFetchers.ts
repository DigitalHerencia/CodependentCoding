import "server-only";

import { assertPermission } from "../authz/permissions";
import { toAudienceDTO, toCampaignDTO } from "../db/dto/marketing.dto";
import {
  audienceSelect,
  campaignSelect,
} from "../db/selects/marketing.selects";
import { withTemplateReadTransaction } from "../db/tenant";

export async function getCampaigns(limit = 50) {
  return withTemplateReadTransaction(async (tx, access) => {
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
  return withTemplateReadTransaction(async (tx, access) => {
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
