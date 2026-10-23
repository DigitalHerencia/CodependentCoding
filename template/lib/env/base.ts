import "server-only";

import { z } from "zod";

/**
 * Validated environment (Architecture.md §2, CC-025). Each owner declares its
 * variables in `lib/env/<owner>.ts` with `defineEnv`; the names, and which are
 * required, match that owner's `env` entries in hipster.modules.json
 * (`pnpm check:env`). Nothing outside `lib/env/` reads `process.env`.
 */

/** Blank values (`KEY=""` in .env.example) count as unset. */
const unset = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const required = () => z.preprocess(unset, z.string().trim().min(1));
export const optional = () =>
  z.preprocess(unset, z.string().trim().min(1).optional());

export interface OwnerEnv<Shape extends z.ZodRawShape> {
  owner: string;
  schema: z.ZodObject<Shape>;
  /** Parsed values; throws once, naming every missing or invalid variable. */
  read(): z.output<z.ZodObject<Shape>>;
  /** True when every required variable is set. */
  configured(): boolean;
  /** One variable, validated alone; undefined when unset or invalid. */
  value<Name extends keyof Shape & string>(
    name: Name,
  ): z.output<Shape[Name]> | undefined;
}

export function defineEnv<Shape extends z.ZodRawShape>(
  owner: string,
  shape: Shape,
): OwnerEnv<Shape> {
  const schema = z.object(shape);
  const parse = () => schema.safeParse(process.env);
  return {
    owner,
    schema,
    read() {
      const result = parse();
      if (result.success) return result.data;
      const names = [
        ...new Set(result.error.issues.map(({ path }) => String(path[0]))),
      ];
      throw new Error(
        `${owner} environment is not configured: set ${names.join(", ")} in .env.local (see .env.example).`,
      );
    },
    configured: () => parse().success,
    value(name) {
      const result = z.safeParse(schema.shape[name], process.env[name]);
      return result.success ? result.data : undefined;
    },
  };
}

/**
 * Whether each named variable is set, without validating an owner. Settings >
 * Integrations uses it with the names each add-on lists in its module definition.
 */
export function hasValues(names: readonly string[]): boolean {
  return names.every((name) => unset(process.env[name]) !== undefined);
}

/** The current environment plus overrides, for child processes (tests, scripts). */
export function childEnv(overrides: Record<string, string>): NodeJS.ProcessEnv {
  return { ...process.env, ...overrides };
}

export const baseEnv = defineEnv("base", {
  DATABASE_URL: required(),
  DIRECT_DATABASE_URL: optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optional(),
  CLERK_SECRET_KEY: optional(),
  CLERK_WEBHOOK_SIGNING_SECRET: optional(),
  DATABASE_URL_TEST: optional(),
  DATABASE_URL_TEST_APP: optional(),
  AUTH_WEBHOOK_DB_TEST: optional(),
});
