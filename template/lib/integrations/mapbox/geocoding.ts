import "server-only"

import { getOptionalEnv, getRequiredEnv } from "@/lib/env"
import type { DirectionsResult, LocationResult } from "@/types/capabilityTypes"

export async function geocodeLocation(query: string): Promise<LocationResult[]> {
  const url = new URL("https://api.mapbox.com/search/geocode/v6/forward")
  url.searchParams.set("q", query)
  url.searchParams.set("access_token", getRequiredEnv("MAPBOX_ACCESS_TOKEN"))
  url.searchParams.set("autocomplete", "false")
  url.searchParams.set("limit", "5")
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
  const value: unknown = await response.json()
  if (!response.ok || typeof value !== "object" || value === null) {
    throw new Error("Mapbox geocoding request failed.")
  }
  const features = (value as { features?: unknown }).features
  if (!Array.isArray(features)) throw new Error("Mapbox returned an invalid geocoding result.")
  return features.flatMap((feature): LocationResult[] => {
    if (typeof feature !== "object" || feature === null) return []
    const item = feature as Record<string, unknown>
    const geometry = item.geometry as { coordinates?: unknown } | undefined
    const coordinates = geometry?.coordinates
    if (
      !Array.isArray(coordinates) ||
      typeof coordinates[0] !== "number" ||
      typeof coordinates[1] !== "number"
    )
      return []
    const properties = (item.properties ?? {}) as Record<string, unknown>
    const label = properties.full_address ?? properties.name ?? item.id
    if (typeof item.id !== "string" || typeof label !== "string") return []
    return [{ id: item.id, label, longitude: coordinates[0], latitude: coordinates[1] }]
  })
}

export async function getDirections(input: {
  origin: [number, number]
  destination: [number, number]
  profile?: "driving" | "walking" | "cycling"
}): Promise<DirectionsResult | null> {
  const coordinates = `${input.origin.join(",")};${input.destination.join(",")}`
  const url = new URL(
    `https://api.mapbox.com/directions/v5/mapbox/${input.profile ?? "driving"}/${coordinates}`
  )
  url.searchParams.set("access_token", getRequiredEnv("MAPBOX_ACCESS_TOKEN"))
  url.searchParams.set("geometries", "geojson")
  url.searchParams.set("overview", "simplified")
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
  const value: unknown = await response.json()
  const route = (value as { routes?: unknown[] }).routes?.[0] as Record<string, unknown> | undefined
  const geometry = route?.geometry as DirectionsResult["geometry"] | undefined
  if (!response.ok) throw new Error("Mapbox directions request failed.")
  if (
    !route ||
    typeof route.distance !== "number" ||
    typeof route.duration !== "number" ||
    geometry?.type !== "LineString" ||
    !Array.isArray(geometry.coordinates)
  )
    return null
  return { distanceMeters: route.distance, durationSeconds: route.duration, geometry }
}

export function getMapRenderingConfig() {
  return {
    accessToken: getRequiredEnv("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"),
    styleUrl:
      getOptionalEnv("NEXT_PUBLIC_MAPBOX_STYLE_URL") ?? "mapbox://styles/mapbox/streets-v12",
  }
}
