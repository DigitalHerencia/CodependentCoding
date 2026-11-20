"use server";
/** Each mutation independently validates identity, permission, ownership and concurrency. */
import { toActionResult } from "@/lib/utils/actionResult";
import { audienceFormSchema, updateAudienceSchema, updateCampaignSchema, createCampaignSchema, updateCampaignStatusSchema, campaignTransitions } from "@/schemas/marketingSchemas";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { toAudienceDTO, toCampaignDTO } from "@/lib/db/dtos/marketingDtos";
import { audienceSelect, campaignSelect } from "@/lib/db/selects/marketingSelects";
import { auditMarketingTx, assertCampaignRelationsTx } from "@/lib/db/selects/marketingTx";
import { withTenantTransaction } from "@/lib/db/tenancy";
import { ConcurrencyConflictError, InvariantViolationError, ResourceNotFoundError } from "@/lib/db/transactions/errors";

export async function createCampaign(rawInput: unknown) {
  return toActionResult(async () => withTenantTransaction(await requireIdentity(), async (tx, access) => {
    assertPermission(access, "marketing.campaign:create");
    const input = createCampaignSchema.parse(rawInput);
    if (input.scheduledAt && input.scheduledAt <= new Date()) throw new InvariantViolationError("Schedule must be in the future.");
    await assertCampaignRelationsTx(tx, access.organizationId, input.audienceId, access.membershipId);
    const record = await tx.campaign.create({ data: {
      organizationId: access.organizationId, ownerMembershipId: access.membershipId,
      audienceId: input.audienceId ?? null, name: input.name, description: input.description ?? null,
      scheduledAt: input.scheduledAt ?? null, status: input.scheduledAt ? "SCHEDULED" : "DRAFT",
    }, select: campaignSelect });
    await auditMarketingTx(tx, access, "Campaign", record.id, "created");
    return toCampaignDTO(record);
  }));
}

/** Planning transitions update timestamps only; no provider or delivery is called. */
export async function updateCampaignStatus(rawInput: unknown) {
  return toActionResult(async () => withTenantTransaction(await requireIdentity(), async (tx, access) => {
    assertPermission(access, "marketing.campaign:update");
    const input = updateCampaignStatusSchema.parse(rawInput);
    const existing = await tx.campaign.findFirst({ where: { id: input.campaignId, organizationId: access.organizationId }, select: { ...campaignSelect, ownerMembershipId: true } });
    if (!existing) throw new ResourceNotFoundError("Campaign");
    if (existing.version !== input.expectedVersion) throw new ConcurrencyConflictError("Campaign");
    if (!campaignTransitions[existing.status].includes(input.status)) throw new InvariantViolationError("This lifecycle transition is not permitted.");
    const now = new Date();
    if (input.status === "SCHEDULED" && (!existing.scheduledAt || existing.scheduledAt <= now)) throw new InvariantViolationError("Scheduling requires a future UTC instant.");
    await assertCampaignRelationsTx(tx, access.organizationId, existing.audience?.id, existing.ownerMembershipId);
    const result = await tx.campaign.updateMany({ where: { id: existing.id, organizationId: access.organizationId, version: input.expectedVersion, status: existing.status }, data: {
      status: input.status, version: { increment: 1 },
      ...(input.status === "DRAFT" ? { scheduledAt: null, startedAt: null, completedAt: null, canceledAt: null } : {}),
      ...(input.status === "ACTIVE" ? { startedAt: existing.startedAt ?? now, completedAt: null, canceledAt: null } : {}),
      ...(input.status === "COMPLETED" ? { completedAt: now, canceledAt: null } : {}),
      ...(input.status === "CANCELED" ? { canceledAt: now, completedAt: null } : {}),
    } });
    if (result.count !== 1) throw new ConcurrencyConflictError("Campaign");
    await auditMarketingTx(tx, access, "Campaign", existing.id, "status-changed");
    return toCampaignDTO(await tx.campaign.findFirstOrThrow({ where: { id: existing.id, organizationId: access.organizationId }, select: campaignSelect }));
  }));
}

export async function updateCampaign(rawInput: unknown) {
  return toActionResult(async () => withTenantTransaction(await requireIdentity(), async (tx, access) => {
    assertPermission(access, "marketing.campaign:update");
    const input = updateCampaignSchema.parse(rawInput);
    const existing = await tx.campaign.findFirst({ where: { id: input.campaignId, organizationId: access.organizationId }, select: { ...campaignSelect, ownerMembershipId: true } });
    if (!existing) throw new ResourceNotFoundError("Campaign");
    if (existing.version !== input.expectedVersion) throw new ConcurrencyConflictError("Campaign");
    if (!["DRAFT", "SCHEDULED", "PAUSED"].includes(existing.status)) throw new InvariantViolationError("This campaign cannot be edited in its current state.");
    if (input.scheduledAt && input.scheduledAt.getTime() !== existing.scheduledAt?.getTime() && input.scheduledAt <= new Date()) throw new InvariantViolationError("Schedule must be in the future.");
    await assertCampaignRelationsTx(tx, access.organizationId, input.audienceId, existing.ownerMembershipId);
    const result = await tx.campaign.updateMany({ where: { id: existing.id, organizationId: access.organizationId, version: input.expectedVersion, status: existing.status }, data: {
      name: input.name, description: input.description ?? null, audienceId: input.audienceId ?? null, scheduledAt: input.scheduledAt ?? null,
      status: existing.status === "PAUSED" ? "PAUSED" : input.scheduledAt ? "SCHEDULED" : "DRAFT", version: { increment: 1 },
    } });
    if (result.count !== 1) throw new ConcurrencyConflictError("Campaign");
    await auditMarketingTx(tx, access, "Campaign", existing.id, "updated");
    return toCampaignDTO(await tx.campaign.findFirstOrThrow({ where: { id: existing.id, organizationId: access.organizationId }, select: campaignSelect }));
  }));
}

export async function createAudience(rawInput: unknown) {
  return toActionResult(async () => withTenantTransaction(await requireIdentity(), async (tx, access) => {
    assertPermission(access, "marketing.audience:create");
    const input = audienceFormSchema.parse(rawInput);
    const record = await tx.audience.create({ data: { ...input, organizationId: access.organizationId }, select: audienceSelect });
    await auditMarketingTx(tx, access, "Audience", record.id, "created");
    return toAudienceDTO(record);
  }));
}

/** Omitting definition preserves rules that this editor cannot safely represent. */
export async function updateAudience(rawInput: unknown) {
  return toActionResult(async () => withTenantTransaction(await requireIdentity(), async (tx, access) => {
    assertPermission(access, "marketing.audience:update");
    const input = updateAudienceSchema.parse(rawInput);
    const existing = await tx.audience.findFirst({ where: { id: input.audienceId, organizationId: access.organizationId }, select: { id: true, updatedAt: true } });
    if (!existing) throw new ResourceNotFoundError("Audience");
    if (existing.updatedAt.getTime() !== input.expectedUpdatedAt.getTime()) throw new ConcurrencyConflictError("Audience");
    // A monotonic millisecond timestamp prevents same-tick writes from sharing an editor token.
    const updatedAt = new Date(Math.max(Date.now(), existing.updatedAt.getTime() + 1));
    // PostgreSQL may retain microseconds; browser tokens represent milliseconds.
    // The monotonic replacement timestamp makes this narrow interval safe for CAS.
    const result = await tx.audience.updateMany({ where: { id: existing.id, organizationId: access.organizationId, updatedAt: { gte: input.expectedUpdatedAt, lt: new Date(input.expectedUpdatedAt.getTime() + 1) } }, data: {
      name: input.name, status: input.status, updatedAt,
      ...(input.definition === undefined ? {} : { definition: input.definition }),
    } });
    if (result.count !== 1) throw new ConcurrencyConflictError("Audience");
    await auditMarketingTx(tx, access, "Audience", existing.id, "updated");
    return toAudienceDTO(await tx.audience.findFirstOrThrow({ where: { id: existing.id, organizationId: access.organizationId }, select: audienceSelect }));
  }));
}
