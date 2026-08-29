import "server-only"

import type { Prisma } from "@/prisma/generated/prisma/client"

export const mediaAssetSelect = {
  id: true,
  publicId: true,
  resourceType: true,
  format: true,
  secureUrl: true,
  status: true,
  createdAt: true,
} satisfies Prisma.MediaAssetSelect

export const locationSelect = {
  id: true,
  label: true,
  longitude: true,
  latitude: true,
  createdAt: true,
} satisfies Prisma.LocationRecordSelect
