import "server-only"

import type { Prisma } from "@/prisma/generated/prisma/client"
import type { SaveLocationInput } from "@/schemas/capabilitySchemas"

export async function recordMediaAssetTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string
    uploadedById: string
    assetId: string
    publicId: string
    resourceType: string
    format: string | null
    secureUrl: string
    bytes: number | null
    width: number | null
    height: number | null
  }
) {
  await tx.providerMediaAssetBinding.createMany({
    data: [{ providerAssetId: input.assetId, organizationId: input.organizationId }],
    skipDuplicates: true,
  })
  return tx.mediaAsset.upsert({
    where: { providerAssetId: input.assetId },
    create: {
      organizationId: input.organizationId,
      uploadedById: input.uploadedById,
      providerAssetId: input.assetId,
      publicId: input.publicId,
      resourceType: input.resourceType,
      format: input.format,
      secureUrl: input.secureUrl,
      bytes: input.bytes,
      width: input.width,
      height: input.height,
      status: "ready",
      providerUpdatedAt: new Date(),
    },
    update: {
      publicId: input.publicId,
      resourceType: input.resourceType,
      format: input.format,
      secureUrl: input.secureUrl,
      bytes: input.bytes,
      width: input.width,
      height: input.height,
      status: "ready",
      providerUpdatedAt: new Date(),
    },
  })
}

export async function reconcileMediaAssetTx(
  tx: Prisma.TransactionClient,
  input: {
    assetId: string
    publicId: string
    resourceType: string
    format?: string
    secureUrl?: string
    bytes?: number
    width?: number
    height?: number
  }
) {
  return tx.mediaAsset.update({
    where: { providerAssetId: input.assetId },
    data: {
      publicId: input.publicId,
      resourceType: input.resourceType,
      ...(input.format !== undefined ? { format: input.format } : {}),
      ...(input.secureUrl !== undefined ? { secureUrl: input.secureUrl } : {}),
      ...(input.bytes !== undefined ? { bytes: input.bytes } : {}),
      ...(input.width !== undefined ? { width: input.width } : {}),
      ...(input.height !== undefined ? { height: input.height } : {}),
      status: "ready",
      providerUpdatedAt: new Date(),
    },
  })
}

export async function createLocationTx(
  tx: Prisma.TransactionClient,
  input: SaveLocationInput & { organizationId: string }
) {
  return tx.locationRecord.create({
    data: {
      organizationId: input.organizationId,
      label: input.label,
      longitude: input.longitude,
      latitude: input.latitude,
      ...(input.mapboxId ? { mapboxId: input.mapboxId } : {}),
    },
  })
}
