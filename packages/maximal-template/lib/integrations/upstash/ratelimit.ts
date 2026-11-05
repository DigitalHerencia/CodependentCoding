import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { hasValues } from "@/lib/utils/env";
import { upstashEnv } from "@/lib/integrations/upstash/env";

/** Backs the `RATE_LIMITED` error code (AUTH.md §8). */
export class RateLimitedError extends Error {
  readonly code = "RATE_LIMITED";

  constructor(message = "Too many requests. Try again shortly.") {
    super(message);
    this.name = "RateLimitedError";
  }
}

export interface RateLimitPolicy {
  requests: number;
  window: Parameters<typeof Ratelimit.slidingWindow>[1];
}

export function isRateLimitConfigured() {
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } =
    upstashEnv.read();
  return Boolean(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN);
}

// No credentials means the optional integration is unused. Partial configuration
// still invokes the limiter so invalid deployments fail closed.
export function isRateLimitRequested() {
  return Object.keys(upstashEnv.schema.shape).some((name) => hasValues([name]));
}

let redis: Redis | undefined;
const limiters = new Map<string, Ratelimit>();

function limiterFor(scope: string, policy: RateLimitPolicy) {
  const key = `${scope}:${policy.requests}/${policy.window}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    const env = upstashEnv.read();
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error(
        "ratelimit environment is not configured: set UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN",
      );
    }
    redis ??= new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(policy.requests, policy.window),
      prefix: `ratelimit:${scope}`,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

/**
 * Sliding window per scope and identifier; throws `RateLimitedError` once the
 * policy is exceeded. Network I/O: call before any database transaction.
 */
export async function enforceRateLimit(
  scope: string,
  identifier: string,
  policy: RateLimitPolicy,
): Promise<void> {
  const { success, reason } = await limiterFor(scope, policy).limit(identifier);
  if (reason === "timeout") throw new Error("Rate limiter unavailable.");
  if (!success) throw new RateLimitedError();
}
