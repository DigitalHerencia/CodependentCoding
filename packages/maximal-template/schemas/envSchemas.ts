import { z } from "zod";

/** Blank values (`KEY=""` in .env.example) count as unset. */
const unset = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const required = () => z.preprocess(unset, z.string().trim().min(1));
export const optional = () =>
  z.preprocess(unset, z.string().trim().min(1).optional());

export type OwnerEnv<Shape extends z.ZodRawShape> = {
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
};

export function createEnvReader<Shape extends z.ZodRawShape>(
  owner: string,
  shape: Shape,
  source: () => Record<string, string | undefined>,
): OwnerEnv<Shape> {
  const schema = z.object(shape);
  const parse = () => schema.safeParse(source());
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
      const result = z.safeParse(schema.shape[name], source()[name]);
      return result.success ? result.data : undefined;
    },
  };
}

export const baseEnvShape = {
  DATABASE_URL: required(),
  DATABASE_URL_UNPOOLED: optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optional(),
  CLERK_SECRET_KEY: optional(),
  CLERK_WEBHOOK_SIGNING_SECRET: optional(),
  DATABASE_URL_TEST: optional(),
  DATABASE_URL_TEST_APP: optional(),
  AUTH_WEBHOOK_DB_TEST: optional(),
  BOOTSTRAP_OWNER_CLERK_USER_ID: optional(),
};
