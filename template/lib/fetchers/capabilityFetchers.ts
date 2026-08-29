import "server-only"

import { unstable_noStore as noStore } from "next/cache"

import { requireTenantContext } from "@/lib/auth/session"
import { assertCapability } from "@/lib/authz/assertions"
import { mapLocationDTO, mapMediaAssetDTO } from "@/lib/db/dto/capability.mappers"
import { locationSelect, mediaAssetSelect } from "@/lib/db/selects/capability.selects"
import { withTenantContext } from "@/lib/db/withTenantContext"

export async function getMediaLibraryState() {
  noStore()
  const context = await requireTenantContext()
  assertCapability(context, "media.read")
  const assets = await withTenantContext(context.organization.id, (tx) =>
    tx.mediaAsset.findMany({
      where: { organizationId: context.organization.id, status: { not: "deleted" } },
      orderBy: { createdAt: "desc" },
      take: 24,
      select: mediaAssetSelect,
    })
  )
  return assets.map(mapMediaAssetDTO)
}

export async function getSavedLocations() {
  noStore()
  const context = await requireTenantContext()
  assertCapability(context, "map.read")
  const locations = await withTenantContext(context.organization.id, (tx) =>
    tx.locationRecord.findMany({
      where: { organizationId: context.organization.id },
      orderBy: { createdAt: "desc" },
      take: 24,
      select: locationSelect,
    })
  )
  return locations.map(mapLocationDTO)
}
