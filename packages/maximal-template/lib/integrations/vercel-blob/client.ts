import "server-only";

import { vercelBlobEnv } from "@/lib/integrations/vercel-blob/env";

export function getBlobToken() {
  return vercelBlobEnv.read().BLOB_READ_WRITE_TOKEN;
}
