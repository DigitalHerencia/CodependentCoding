import "server-only";

import { v2 as cloudinary } from "cloudinary";

let configured = false;
export function getCloudinaryClient() {
  const {
    CLOUDINARY_CLOUD_NAME: cloud_name,
    CLOUDINARY_API_KEY: api_key,
    CLOUDINARY_API_SECRET: api_secret,
  } = process.env;
  if (!cloud_name || !api_key || !api_secret)
    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.",
    );
  if (!configured) {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    configured = true;
  }
  return cloudinary;
}
