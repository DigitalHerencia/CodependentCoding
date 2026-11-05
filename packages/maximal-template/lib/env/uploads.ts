import "server-only";

import { defineEnv, required } from "@/lib/env/base";

export const uploadsEnv = defineEnv("uploads", {
  BLOB_READ_WRITE_TOKEN: required(),
});
