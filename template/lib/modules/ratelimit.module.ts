import type { ModuleDefinition } from "@/types/moduleTypes";

export const ratelimitModule = {
  id: "ratelimit",
  integration: {
    name: "Upstash",
    purpose: "Rate limiting for metered features",
    env: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  },
} satisfies ModuleDefinition;
