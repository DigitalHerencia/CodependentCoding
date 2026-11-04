import "server-only";

import { defineEnv, optional } from "@/lib/env/base";

export const ratelimitEnv = defineEnv("ratelimit", {
  UPSTASH_REDIS_REST_URL: optional(),
  UPSTASH_REDIS_REST_TOKEN: optional(),
});
