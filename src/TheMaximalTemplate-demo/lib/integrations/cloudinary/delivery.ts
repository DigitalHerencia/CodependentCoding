import "server-only"

import { getRequiredEnv } from "@/lib/env"

export function cloudinaryDeliveryUrl(input: {
  publicId: string
  resourceType?: "image" | "video" | "raw"
  transformation?: { width?: number; height?: number; crop?: "fill" | "fit" | "limit" }
}): string {
  const transformation = input.transformation
    ? [
        input.transformation.width ? `w_${input.transformation.width}` : null,
        input.transformation.height ? `h_${input.transformation.height}` : null,
        input.transformation.crop ? `c_${input.transformation.crop}` : null,
        "f_auto",
        "q_auto",
      ]
        .filter(Boolean)
        .join(",")
    : "f_auto,q_auto"
  const publicId = input.publicId.split("/").map(encodeURIComponent).join("/")
  return `https://res.cloudinary.com/${encodeURIComponent(getRequiredEnv("CLOUDINARY_CLOUD_NAME"))}/${input.resourceType ?? "image"}/upload/${transformation}/${publicId}`
}
