/** Independently authorized, tenant-scoped marketing reads and planning aggregates. */
import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { MarketingAnalyticsDTO, MarketingCapabilities } from "@/types/marketingTypes";
import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import { toAudienceDTO, toCampaignDTO, toCampaignStepDTO } from "@/lib/db/dtos/marketingDtos";
import { audienceSelect, campaignSelect, campaignStepSelect } from "@/lib/db/selects/marketingSelects";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { persistedRecordIdSchema } from "@/schemas/commonSchemas";
import { audienceListSchema, campaignListSchema, marketingAnalyticsSchema } from "@/schemas/marketingSchemas";

/** Capability hints never replace the independent permission check on each operation. */
export async function getMarketingCapabilities(): Promise<MarketingCapabilities> {
  return withAuthenticatedRead(async (_tx, access) => ({
    canReadCampaigns: hasPermission(access, "marketing.campaign:read"),
    canCreateCampaigns: hasPermission(access, "marketing.campaign:create"),
    canUpdateCampaigns: hasPermission(access, "marketing.campaign:update"),
    canReadAudiences: hasPermission(access, "marketing.audience:read"),
    canCreateAudiences: hasPermission(access, "marketing.audience:create"),
    canUpdateAudiences: hasPermission(access, "marketing.audience:update"),
  }));
}

/** Lists are bounded and use a stable ID tie-breaker even when timestamps match. */
export async function getCampaigns(rawCriteria: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.campaign:read");
    const criteria = campaignListSchema.parse(typeof rawCriteria === "number" ? { pageSize: rawCriteria } : rawCriteria);
    const where: Prisma.CampaignWhereInput = {
      organizationId: access.organizationId,
      ...(criteria.status === "ALL" ? {} : { status: criteria.status }),
      ...(criteria.search ? { name: { contains: criteria.search, mode: "insensitive" } } : {}),
    };
    const total = await tx.campaign.count({ where });
    const pageCount = Math.max(1, Math.ceil(total / criteria.pageSize));
    const page = Math.min(criteria.page, pageCount);
    const rows = await tx.campaign.findMany({ where, orderBy: [{ updatedAt: "desc" }, { id: "asc" }], skip: (page - 1) * criteria.pageSize, take: criteria.pageSize, select: campaignSelect });
    return { items: rows.map(toCampaignDTO), total, page, pageSize: criteria.pageSize, pageCount, criteria: { ...criteria, page } };
  });
}

export async function getAudiences(rawCriteria: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.audience:read");
    const criteria = audienceListSchema.parse(typeof rawCriteria === "number" ? { pageSize: rawCriteria } : rawCriteria);
    const where: Prisma.AudienceWhereInput = {
      organizationId: access.organizationId,
      ...(criteria.status === "ALL" ? {} : { status: criteria.status }),
      ...(criteria.search ? { name: { contains: criteria.search, mode: "insensitive" } } : {}),
    };
    const total = await tx.audience.count({ where });
    const pageCount = Math.max(1, Math.ceil(total / criteria.pageSize));
    const page = Math.min(criteria.page, pageCount);
    const rows = await tx.audience.findMany({ where, orderBy: [{ updatedAt: "desc" }, { id: "asc" }], skip: (page - 1) * criteria.pageSize, take: criteria.pageSize, select: audienceSelect });
    return { items: rows.map(toAudienceDTO), total, page, pageSize: criteria.pageSize, pageCount, criteria: { ...criteria, page } };
  });
}

export async function getCampaign(rawId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.campaign:read");
    const id = persistedRecordIdSchema.parse(rawId);
    const record = await tx.campaign.findFirst({ where: { id, organizationId: access.organizationId }, select: campaignSelect });
    return record ? toCampaignDTO(record) : null;
  });
}
export async function getAudience(rawId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.audience:read");
    const id = persistedRecordIdSchema.parse(rawId);
    const record = await tx.audience.findFirst({ where: { id, organizationId: access.organizationId }, select: audienceSelect });
    return record ? toAudienceDTO(record) : null;
  });
}

export async function getCampaignSteps(rawId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.campaign:read");
    const campaignId = persistedRecordIdSchema.parse(rawId);
    if (!await tx.campaign.findFirst({ where: { id: campaignId, organizationId: access.organizationId }, select: { id: true } })) throw new ResourceNotFoundError("Campaign");
    const rows = await tx.campaignStep.findMany({ where: { campaignId, organizationId: access.organizationId }, orderBy: [{ position: "asc" }, { id: "asc" }], select: campaignStepSelect });
    return rows.map(toCampaignStepDTO);
  });
}

/** All counts cover the authorized organization's created-at range, never just a page. */
export async function getMarketingAnalytics(rawCriteria: unknown = {}): Promise<MarketingAnalyticsDTO> {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "marketing.campaign:read");
    assertPermission(access, "marketing.audience:read");
    const criteria = marketingAnalyticsSchema.parse(rawCriteria);
    const scope = { organizationId: access.organizationId, createdAt: { ...(criteria.from ? { gte: new Date(criteria.from) } : {}), ...(criteria.to ? { lt: new Date(criteria.to) } : {}) } };
    const campaigns = await tx.campaign.groupBy({ by: ["status"], where: scope, _count: { _all: true } });
    const audiences = await tx.audience.groupBy({ by: ["status"], where: scope, _count: { _all: true } });
    const stepTotal = await tx.campaignStep.count({ where: { organizationId: access.organizationId, campaign: scope } });
    const recentCampaigns = await tx.campaign.findMany({ where: scope, orderBy: [{ updatedAt: "desc" }, { id: "asc" }], take: 6, select: campaignSelect });
    return {
      from: criteria.from ?? null, to: criteria.to ?? null,
      campaignTotal: campaigns.reduce((sum, row) => sum + row._count._all, 0),
      audienceTotal: audiences.reduce((sum, row) => sum + row._count._all, 0),
      scheduledCampaigns: campaigns.find((row) => row.status === "SCHEDULED")?._count._all ?? 0,
      stepTotal,
      campaignStatuses: campaigns.map((row) => ({ status: row.status, count: row._count._all })),
      audienceStatuses: audiences.map((row) => ({ status: row.status, count: row._count._all })),
      recentCampaigns: recentCampaigns.map(toCampaignDTO),
    };
  });
}
