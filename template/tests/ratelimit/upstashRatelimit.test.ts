import { afterEach, expect, test, vi } from "vitest";

const limit = vi.fn<(identifier: string) => Promise<{ success: boolean }>>();

vi.mock("@upstash/redis", () => ({ Redis: class {} }));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(
    class {
      limit = limit;
    },
    { slidingWindow: () => ({}) },
  ),
}));

const { enforceRateLimit, isRateLimitConfigured, RateLimitedError } =
  await import("@/lib/integrations/upstash/ratelimit");

afterEach(() => vi.unstubAllEnvs());

const policy = { requests: 5, window: "60 s" } as const;

test("unconfigured: reports it and fails fast naming the variables", async () => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  expect(isRateLimitConfigured()).toBe(false);
  await expect(enforceRateLimit("ai-generate", "user", policy)).rejects.toThrow(
    "ratelimit environment is not configured: set UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN",
  );
});

test("over the limit throws RATE_LIMITED; under it passes", async () => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
  expect(isRateLimitConfigured()).toBe(true);

  limit.mockResolvedValueOnce({ success: true });
  await expect(
    enforceRateLimit("ai-generate", "user", policy),
  ).resolves.toBeUndefined();

  limit.mockResolvedValueOnce({ success: false });
  const error = await enforceRateLimit("ai-generate", "user", policy).catch(
    (cause: unknown) => cause,
  );
  expect(error).toBeInstanceOf(RateLimitedError);
  expect((error as InstanceType<typeof RateLimitedError>).code).toBe(
    "RATE_LIMITED",
  );
  expect(limit).toHaveBeenLastCalledWith("user");
});
