import "server-only"

import { getPrisma } from "@/lib/db/prisma"
import { reconcileMediaAssetTx } from "@/lib/db/transactions/capabilityTransactions"
import {
  claimProviderWebhookEvent,
  finalizeIgnoredWebhookTx,
  finalizeProcessedWebhookTx,
  markWebhookFailed,
} from "@/lib/db/transactions/webhookTransactions"
import { withTenantContext } from "@/lib/db/withTenantContext"
import type { PrismaClient } from "@/prisma/generated/prisma/client"
import type { z } from "zod"
import type { cloudinaryNotificationSchema } from "@/schemas/capabilitySchemas"
import type { WebhookProcessingResult } from "@/types/webhookTypes"

type Notification = z.infer<typeof cloudinaryNotificationSchema>

export async function reconcileCloudinaryWebhook(
  event: Notification,
  options: { providerEventId: string; prisma?: PrismaClient; now?: Date }
): Promise<WebhookProcessingResult> {
  const prisma = options.prisma ?? getPrisma()
  const now = options.now ?? new Date()
  const claim = await claimProviderWebhookEvent(
    prisma,
    {
      provider: "cloudinary",
      providerEventId: options.providerEventId,
      eventType: event.notification_type,
      safeMetadata: { asset_id: event.asset_id, resource_type: event.resource_type },
    },
    now,
    5 * 60 * 1000
  )
  if (claim.kind === "terminal") return { ok: true, status: "duplicate" }
  if (claim.kind === "processing") return { ok: true, status: "processing" }
  try {
    const binding = await prisma.providerMediaAssetBinding.findUnique({
      where: { providerAssetId: event.asset_id },
      select: { organizationId: true },
    })
    if (!binding) {
      await prisma.$transaction((tx) => finalizeIgnoredWebhookTx(tx, claim, now))
      return { ok: true, status: "ignored" }
    }
    await withTenantContext(
      binding.organizationId,
      async (tx) => {
        await reconcileMediaAssetTx(tx, {
          assetId: event.asset_id,
          publicId: event.public_id,
          resourceType: event.resource_type,
          ...(event.format ? { format: event.format } : {}),
          ...(event.secure_url ? { secureUrl: event.secure_url } : {}),
          ...(event.bytes !== undefined ? { bytes: event.bytes } : {}),
          ...(event.width !== undefined ? { width: event.width } : {}),
          ...(event.height !== undefined ? { height: event.height } : {}),
        })
        await finalizeProcessedWebhookTx(tx, claim, now)
      },
      undefined,
      prisma
    )
    return { ok: true, status: "processed" }
  } catch {
    await markWebhookFailed(prisma, claim)
    return { ok: false, status: "failed" }
  }
}
