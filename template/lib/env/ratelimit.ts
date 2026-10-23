import "server-only";

import { defineEnv, required } from "@/lib/env/base";

export const ratelimitEnv = defineEnv("ratelimit", {
  UPSTASH_REDIS_REST_URL: required(),
  UPSTASH_REDIS_REST_TOKEN: required(),
});
