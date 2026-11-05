import "server-only";

import { defineEnv } from "@/lib/utils/env";
import { optional } from "@/schemas/envSchemas";

export const upstashEnv = defineEnv("ratelimit", {
  UPSTASH_REDIS_REST_URL: optional(),
  UPSTASH_REDIS_REST_TOKEN: optional(),
});
