import "server-only";

import { v2 as cloudinary } from "cloudinary";

import { mediaEnv } from "@/lib/env/media";

let configured = false;
export function getCloudinaryClient() {
  if (!configured) {
    const env = mediaEnv.read();
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}
