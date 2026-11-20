import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { claimIdempotencyTx, completeIdempotencyTx } from "@/lib/db/transactions/idempotencyTx";
import { InvariantViolationError, ResourceNotFoundError } from "@/lib/db/transactions/errors";
import type { AccessContext } from "@/types/authzTypes";
import type { MarketingCampaignEventInput } from "@/types/marketingTypes";
import { assertPermission } from "@/lib/authz/permissions";
import { marketingCampaignEventSchema } from "@/schemas/marketingSchemas";

/** Audit only trusted identity and operation metadata in the same transaction as the write. */
export async function auditMarketingTx(tx: Prisma.TransactionClient, access: AccessContext, resourceType: "Campaign" | "Audience", resourceId: string, operation: "created" | "updated" | "status-changed") {
  await tx.auditEvent.create({ data: { organizationId: access.organizationId, actorUserId: access.userId, action: `marketing.${resourceType.toLowerCase()}.${operation}`, resourceType, resourceId } });
}

/** Revalidate every persisted relationship before changing campaign planning data. */
export async function assertCampaignRelationsTx(tx: Prisma.TransactionClient, organizationId: string, audienceId: string | null | undefined, ownerMembershipId: string | null) {
  if (audienceId && !await tx.audience.findFirst({ where: { id: audienceId, organizationId }, select: { id: true } })) throw new ResourceNotFoundError("Audience");
  if (ownerMembershipId && !await tx.membership.findFirst({ where: { id: ownerMembershipId, organizationId, status: "ACTIVE" }, select: { id: true } })) throw new ResourceNotFoundError("Owner membership");
}

/** Record idempotent planning events using trusted identity, without executing delivery. */
export async function processCampaignEventTx(
  tx: Prisma.TransactionClient,
  access: AccessContext,
  rawInput: MarketingCampaignEventInput,
) {
  assertPermission(access, "marketing.campaign:update");
  const input = marketingCampaignEventSchema.parse(rawInput);
  const claim = await claimIdempotencyTx(tx, {
    organizationId: access.organizationId,
    scope: "marketing.campaign-event",
    key: input.idempotencyKey,
  });
  if (!claim.claimed) {
    if (claim.state === "COMPLETED") return claim.result;
    throw new InvariantViolationError(
      "This campaign event is already being processed.",
    );
  }
  const campaign = await tx.campaign.findFirst({
    where: { id: input.campaignId, organizationId: access.organizationId },
    select: { id: true },
  });
  if (!campaign) throw new ResourceNotFoundError("Campaign");
  const event = await tx.auditEvent.create({
    data: {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      action: `marketing.campaign.${input.eventType}`,
      resourceType: "Campaign",
      resourceId: campaign.id,
      metadata: {
        idempotencyKey: input.idempotencyKey,
      },
    },
    select: { id: true, action: true, createdAt: true },
  });
  const result = {
    id: event.id,
    action: event.action,
    createdAt: event.createdAt.toISOString(),
  };
  await completeIdempotencyTx(tx, { id: claim.id, result });
  return result;
}
