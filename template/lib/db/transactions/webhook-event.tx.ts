import { createHash } from "node:crypto";

import type { Prisma } from "../../../generated/prisma/client";

export function hashWebhookPayload(payload: string) {
  return createHash("sha256").update(payload).digest("hex");
}

export async function claimWebhookEventTx(
  tx: Prisma.TransactionClient,
  input: {
    provider: string;
    eventId: string;
    type: string;
    payload: string;
    organizationId?: string | null;
  },
) {
  const inserted = await tx.$queryRaw<Array<{ id: string }>>`
    INSERT INTO "WebhookEvent" ("id", "organizationId", "provider", "eventId", "type", "status", "payloadHash", "receivedAt")
    VALUES (gen_random_uuid(), ${input.organizationId ?? null}::uuid, ${input.provider}, ${input.eventId}, ${input.type}, 'PROCESSING', ${hashWebhookPayload(input.payload)}, now())
    ON CONFLICT ("provider", "eventId") DO UPDATE
    SET
      "organizationId" = EXCLUDED."organizationId",
      "type" = EXCLUDED."type",
      "status" = 'PROCESSING',
      "payloadHash" = EXCLUDED."payloadHash",
      "receivedAt" = now(),
      "processedAt" = NULL,
      "errorCode" = NULL
    WHERE "WebhookEvent"."status" = 'FAILED'
       OR (
         "WebhookEvent"."status" = 'PROCESSING'
         AND "WebhookEvent"."receivedAt" < now() - interval '5 minutes'
       )
    RETURNING "id"
  `;
  return inserted[0]?.id ?? null;
}

export function completeWebhookEventTx(
  tx: Prisma.TransactionClient,
  webhookEventId: string,
) {
  return tx.webhookEvent.update({
    where: { id: webhookEventId },
    data: { status: "PROCESSED", processedAt: new Date(), errorCode: null },
  });
}
