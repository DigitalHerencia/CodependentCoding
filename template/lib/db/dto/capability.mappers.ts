import "server-only"

import type { Prisma } from "@/prisma/generated/prisma/client"
import { locationSelect, mediaAssetSelect } from "@/lib/db/selects/capability.selects"
import type { MediaAssetDTO, SavedLocationDTO } from "@/types/capabilityTypes"

type MediaRecord = Prisma.MediaAssetGetPayload<{ select: typeof mediaAssetSelect }>
type LocationRecord = Prisma.LocationRecordGetPayload<{ select: typeof locationSelect }>

export function mapMediaAssetDTO(record: MediaRecord): MediaAssetDTO {
  return { ...record, createdAt: record.createdAt.toISOString() }
}

export function mapLocationDTO(record: LocationRecord): SavedLocationDTO {
  return {
    id: record.id,
    label: record.label,
    longitude: Number(record.longitude),
    latitude: Number(record.latitude),
    createdAt: record.createdAt.toISOString(),
  }
}
