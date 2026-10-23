import "server-only";

import { defineEnv, optional, required } from "@/lib/env/base";

export const inferenceEnv = defineEnv("inference", {
  HUGGINGFACE_ACCESS_TOKEN: required(),
  HUGGINGFACE_TEXT_MODEL: optional(),
});
