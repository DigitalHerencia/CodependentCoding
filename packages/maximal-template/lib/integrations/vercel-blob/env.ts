import "server-only";

import { defineEnv } from "@/lib/utils/env";
import { required } from "@/schemas/envSchemas";

export const vercelBlobEnv = defineEnv("uploads", {
  BLOB_READ_WRITE_TOKEN: required(),
});
