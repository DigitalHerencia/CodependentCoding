"use server";

import {
  createCampaignSchema,
  updateCampaignStatusSchema,
} from "../../schemas/marketingSchemas";

import { requireIdentity } from "../auth/identity";
import { assertPermission } from "../authz/permissions";
import { toCampaignDTO } from "../db/dto/marketing.dto";
import { campaignSelect } from "../db/selects/marketing.selects";
import { withTenantTransaction } from "../db/tenant";
import { ConcurrencyConflictError } from "../db/transactions/errors";

export async function createCampaign(rawInput: unknown) {
  const input = createCampaignSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "marketing:write");

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
        startedAt: input.status === "ACTIVE" ? new Date() : undefined,
        completedAt: input.status === "COMPLETED" ? new Date() : undefined,
        version: {
          increment: 1,
        },
      },
    });

    if (result.count !== 1) {
      throw new ConcurrencyConflictError("Campaign");
    }

    const record = await tx.campaign.findFirstOrThrow({
      where: {
        id: input.campaignId,
        organizationId: access.organizationId,
      },
      select: campaignSelect,
    });

    return toCampaignDTO(record);
  });
}
