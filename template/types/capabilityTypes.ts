export type MediaAssetDTO = {
  id: string
  publicId: string
  resourceType: string
  format: string | null
  secureUrl: string | null
  status: "pending" | "ready" | "deleted" | "failed"
  createdAt: string
}

export type InferenceResult = { model: string; text: string }

export type LocationResult = {
  id: string
  label: string
  longitude: number
  latitude: number
}

export type SavedLocationDTO = LocationResult & { createdAt: string }

export type DirectionsResult = {
  distanceMeters: number
  durationSeconds: number
  geometry: { type: "LineString"; coordinates: number[][] }
}
