import "server-only";

import { uploadsEnv } from "@/lib/env/uploads";

export function getBlobToken() {
  return uploadsEnv.read().BLOB_READ_WRITE_TOKEN;
}
