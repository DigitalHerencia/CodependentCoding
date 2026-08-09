import "server-only"

import { getOptionalEnv, getRequiredEnv } from "@/lib/env"
import { signCloudinaryParameters } from "@/lib/integrations/cloudinary/signatures"

type CloudinaryUploadResult = {
  assetId: string
  publicId: string
  resourceType: string
  format: string | null
  secureUrl: string
  bytes: number | null
  width: number | null
  height: number | null
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const cloudName = getRequiredEnv("CLOUDINARY_CLOUD_NAME")
  const apiKey = getRequiredEnv("CLOUDINARY_API_KEY")
  const apiSecret = getRequiredEnv("CLOUDINARY_API_SECRET")
  const timestamp = Math.floor(Date.now() / 1000)
  const algorithm =
    getOptionalEnv("CLOUDINARY_SIGNATURE_ALGORITHM") === "sha256" ? "sha256" : "sha1"
  const signature = signCloudinaryParameters({ timestamp }, apiSecret, algorithm)
  const body = new FormData()
  body.set("file", file)
  body.set("api_key", apiKey)
  body.set("timestamp", String(timestamp))
  body.set("signature", signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(30_000),
  })
  const value: unknown = await response.json()
  if (!response.ok || typeof value !== "object" || value === null) {
    throw new Error("Cloudinary upload failed.")
  }
  const result = value as Record<string, unknown>
  if (
    typeof result.asset_id !== "string" ||
    typeof result.public_id !== "string" ||
    typeof result.secure_url !== "string"
  ) {
    throw new Error("Cloudinary returned an invalid upload result.")
  }
  return {
    assetId: result.asset_id,
    publicId: result.public_id,
    resourceType: typeof result.resource_type === "string" ? result.resource_type : "raw",
    format: typeof result.format === "string" ? result.format : null,
    secureUrl: result.secure_url,
    bytes: typeof result.bytes === "number" ? result.bytes : null,
    width: typeof result.width === "number" ? result.width : null,
    height: typeof result.height === "number" ? result.height : null,
  }
}
