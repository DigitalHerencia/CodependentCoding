import type { Prisma } from "@/generated/prisma/client";
import { claimIdempotencyTx, completeIdempotencyTx } from "./idempotency.tx";
import { InvariantViolationError, ResourceNotFoundError } from "./errors";

export async function processCampaignEventTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    actorUserId: string;
    campaignId: string;
    eventType: string;
    idempotencyKey: string;
    payload: Prisma.InputJsonValue;
  },
) {
  const claim = await claimIdempotencyTx(tx, {
    organizationId: input.organizationId,
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
    where: { id: input.campaignId, organizationId: input.organizationId },
    select: { id: true },
  });
  if (!campaign) throw new ResourceNotFoundError("Campaign");
  const event = await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: `marketing.campaign.${input.eventType}`,
      resourceType: "Campaign",
      resourceId: campaign.id,
      metadata: {
        payload: input.payload,
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
