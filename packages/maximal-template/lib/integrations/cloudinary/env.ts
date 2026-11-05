import "server-only";

import { defineEnv } from "@/lib/utils/env";
import { required } from "@/schemas/envSchemas";

export const cloudinaryEnv = defineEnv("media", {
  CLOUDINARY_CLOUD_NAME: required(),
  CLOUDINARY_API_KEY: required(),
  CLOUDINARY_API_SECRET: required(),
});
