import "server-only";

import type { z } from "zod";
import { baseEnvShape, createEnvReader } from "@/schemas/envSchemas";

export { isDevelopment, isProduction } from "@/lib/constants/mode";

/** Access is lazy: optional integrations need no credentials until used. */
export function defineEnv<Shape extends z.ZodRawShape>(
  owner: string,
  shape: Shape,
) {
  return createEnvReader(owner, shape, () => process.env);
}

/**
 * Whether each named variable is set, without validating an owner. Settings >
 * Integrations uses it with the names each add-on lists in its module definition.
 */
export function hasValues(names: readonly string[]): boolean {
  return names.every((name) => Boolean(process.env[name]?.trim()));
}

/** Whether an optional integration has been partially configured. */
export function hasAnyValue(names: readonly string[]): boolean {
  return names.some((name) => Boolean(process.env[name]?.trim()));
}

/** The current environment plus overrides, for child processes (tests, scripts). */
export function childEnv(overrides: Record<string, string>): NodeJS.ProcessEnv {
  return { ...process.env, ...overrides };
}

export const baseEnv = defineEnv("base", baseEnvShape);
