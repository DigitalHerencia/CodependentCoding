import "server-only";

import { defineEnv, required } from "@/lib/env/base";

export const mediaEnv = defineEnv("media", {
  CLOUDINARY_CLOUD_NAME: required(),
  CLOUDINARY_API_KEY: required(),
  CLOUDINARY_API_SECRET: required(),
});
