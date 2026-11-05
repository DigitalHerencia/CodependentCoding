import "server-only";

import { defineEnv } from "@/lib/utils/env";
import { optional, required } from "@/schemas/envSchemas";

export const huggingFaceEnv = defineEnv("inference", {
  HUGGINGFACE_ACCESS_TOKEN: required(),
  HUGGINGFACE_TEXT_MODEL: optional(),
});
