import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { ratelimitEnv } from "@/lib/env/ratelimit";

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
  return ratelimitEnv.configured();
}

let redis: Redis | undefined;
const limiters = new Map<string, Ratelimit>();

function limiterFor(scope: string, policy: RateLimitPolicy) {
  const key = `${scope}:${policy.requests}/${policy.window}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    const env = ratelimitEnv.read();
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
  const { success } = await limiterFor(scope, policy).limit(identifier);
  if (!success) throw new RateLimitedError();
}
