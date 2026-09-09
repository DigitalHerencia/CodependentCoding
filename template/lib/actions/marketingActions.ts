"use server";

import {
  audienceFormSchema,
  updateAudienceSchema,
  updateCampaignSchema,
  createCampaignSchema,
  updateCampaignStatusSchema,
} from "@/schemas/marketingSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toAudienceDTO, toCampaignDTO } from "@/lib/db/dto/marketing.dto";
import {
  audienceSelect,
  campaignSelect,
} from "@/lib/db/selects/marketing.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { ConcurrencyConflictError } from "@/lib/db/transactions/errors";

export async function createCampaign(rawInput: unknown) {
  const input = createCampaignSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "marketing:write");
    if (
      input.audienceId &&
      !(await tx.audience.findFirst({
        where: { id: input.audienceId, organizationId: access.organizationId },
        select: { id: true },
      }))
    )
      throw new Error("Audience not found.");
    const record = await tx.campaign.create({
      data: {
        organizationId: access.organizationId,
        ownerMembershipId: access.membershipId,
        audienceId: input.audienceId ?? null,
        name: input.name,
        description: input.description ?? null,
        scheduledAt: input.scheduledAt ?? null,
        status: input.scheduledAt ? "SCHEDULED" : "DRAFT",
      },
      select: campaignSelect,
    });
    return toCampaignDTO(record);
  });
}

export async function updateCampaignStatus(rawInput: unknown) {
  const input = updateCampaignStatusSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "marketing:write");
    const result = await tx.campaign.updateMany({
      where: {
        id: input.campaignId,
        organizationId: access.organizationId,
        version: input.expectedVersion,
      },
      data: {
        status: input.status,
        ...(input.status === "ACTIVE" ? { startedAt: new Date() } : {}),
        ...(input.status === "COMPLETED" ? { completedAt: new Date() } : {}),
        version: { increment: 1 },
      },
    });
    if (result.count !== 1) throw new ConcurrencyConflictError("Campaign");
    const record = await tx.campaign.findFirstOrThrow({
      where: { id: input.campaignId, organizationId: access.organizationId },
      select: campaignSelect,
    });
    return toCampaignDTO(record);
  });
}

export async function updateCampaign(rawInput: unknown) {
  const input = updateCampaignSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "marketing:write");
    if (
      input.audienceId &&
      !(await tx.audience.findFirst({
        where: { id: input.audienceId, organizationId: access.organizationId },
        select: { id: true },
      }))
    )
      throw new Error("Audience not found.");
    const result = await tx.campaign.updateMany({
      where: {
        id: input.campaignId,
        organizationId: access.organizationId,
        version: input.expectedVersion,
        status: { in: ["DRAFT", "SCHEDULED", "PAUSED"] },
      },
      data: {
        name: input.name,
        description: input.description ?? null,
        audienceId: input.audienceId ?? null,
        scheduledAt: input.scheduledAt ?? null,
        version: { increment: 1 },
      },
    });
    if (result.count !== 1) throw new ConcurrencyConflictError("Campaign");
    return toCampaignDTO(
      await tx.campaign.findFirstOrThrow({
        where: { id: input.campaignId, organizationId: access.organizationId },
        select: campaignSelect,
      }),
    );
  });
}

export async function createAudience(rawInput: unknown) {
  const input = audienceFormSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "marketing:write");
    return toAudienceDTO(
      await tx.audience.create({
        data: { ...input, organizationId: access.organizationId },
        select: audienceSelect,
      }),
    );
  });
}
export async function updateAudience(rawInput: unknown) {
  const input = updateAudienceSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "marketing:write");
    const result = await tx.audience.updateMany({
      where: {
        id: input.audienceId,
        organizationId: access.organizationId,
        updatedAt: input.expectedUpdatedAt,
      },
      data: {
        name: input.name,
        status: input.status,
        definition: input.definition,
      },
    });
    if (result.count !== 1) throw new ConcurrencyConflictError("Audience");
    return toAudienceDTO(
      await tx.audience.findFirstOrThrow({
        where: { id: input.audienceId, organizationId: access.organizationId },
        select: audienceSelect,
      }),
    );
  });
}
