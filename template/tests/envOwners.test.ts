import { afterEach, expect, test, vi } from "vitest";

import { defineEnv, optional, required } from "@/lib/env/base";

afterEach(() => vi.unstubAllEnvs());

const env = defineEnv("example", {
  EXAMPLE_KEY: required(),
  EXAMPLE_SECRET: required(),
  EXAMPLE_MODEL: optional(),
});

test("missing required variables fail with every name and the owner", () => {
  vi.stubEnv("EXAMPLE_KEY", "");
  vi.stubEnv("EXAMPLE_SECRET", undefined);
  expect(env.configured()).toBe(false);
  expect(() => env.read()).toThrow(
    "example environment is not configured: set EXAMPLE_KEY, EXAMPLE_SECRET in .env.local",
  );
});

test("set values are trimmed; optional ones may be blank", () => {
  vi.stubEnv("EXAMPLE_KEY", " key ");
  vi.stubEnv("EXAMPLE_SECRET", "secret");
  vi.stubEnv("EXAMPLE_MODEL", "");
  expect(env.configured()).toBe(true);
  expect(env.read()).toEqual({ EXAMPLE_KEY: "key", EXAMPLE_SECRET: "secret" });
  expect(env.value("EXAMPLE_MODEL")).toBeUndefined();
});

test("value() reads one variable without requiring the rest", () => {
  vi.stubEnv("EXAMPLE_KEY", undefined);
  vi.stubEnv("EXAMPLE_MODEL", "model");
  expect(env.value("EXAMPLE_MODEL")).toBe("model");
});
