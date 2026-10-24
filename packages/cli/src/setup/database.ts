import { createRequire } from "node:module";
import path from "node:path";

export const APP_ROLE = "app_user";
export const OWNER_ROLE = "owner";

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/;
const PASSWORD = /^[A-Za-z0-9]+$/;

/**
 * The runtime role (AUTH.md §6): LOGIN, NOBYPASSRLS, table rights only. Created
 * in SQL rather than the Neon API so the attributes are explicit, as in the CI
 * rls job. Default privileges cover the tables `pnpm db:init` creates later as
 * the owner. Re-running resets the password, so the step is idempotent; an
 * existing app_user with BYPASSRLS is refused rather than reused.
 */
export function appRoleSql(password: string, owner = OWNER_ROLE): string {
  if (!PASSWORD.test(password))
    throw new Error("password must be alphanumeric");
  if (!IDENTIFIER.test(owner)) throw new Error(`invalid owner role "${owner}"`);
  const role = `"${APP_ROLE}"`;
  const rights = "SELECT, INSERT, UPDATE, DELETE";
  return [
    "DO $$ BEGIN",
    `  IF EXISTS (SELECT FROM pg_roles WHERE rolname = '${APP_ROLE}') THEN`,
    // Only a BYPASSRLS role may write that attribute, so check it instead.
    `    ALTER ROLE ${role} LOGIN PASSWORD '${password}';`,
    `    IF (SELECT rolbypassrls FROM pg_roles WHERE rolname = '${APP_ROLE}') THEN`,
    `      RAISE EXCEPTION '${APP_ROLE} has BYPASSRLS; it cannot be the runtime role';`,
    "    END IF;",
    "  ELSE",
    `    CREATE ROLE ${role} LOGIN NOBYPASSRLS PASSWORD '${password}';`,
    "  END IF;",
    "END $$;",
    `GRANT USAGE ON SCHEMA public TO ${role};`,
    `GRANT ${rights} ON ALL TABLES IN SCHEMA public TO ${role};`,
    `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${role};`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE "${owner}" IN SCHEMA public GRANT ${rights} ON TABLES TO ${role};`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE "${owner}" IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ${role};`,
  ].join("\n");
}

/** The owner's URL with the app role's credentials (same host, pooling, db). */
export function withCredentials(
  url: string,
  user: string,
  password: string,
): string {
  const next = new URL(url);
  next.username = user;
  next.password = password;
  return next.href;
}

export type RunSql = (url: string, sql: string) => Promise<void>;

interface PgClient {
  connect(): Promise<void>;
  query(sql: string): Promise<unknown>;
  end(): Promise<void>;
}

/** Runs SQL with the template's `pg` (the CLI ships no database driver). */
export function templateSqlRunner(templateDir: string): RunSql {
  return async (url, sql) => {
    const require = createRequire(path.join(templateDir, "package.json"));
    const pg = require("pg") as {
      Client: new (config: { connectionString: string }) => PgClient;
    };
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    try {
      await client.query(sql);
    } finally {
      await client.end();
    }
  };
}

export type QuerySql = (
  url: string,
  sql: string,
) => Promise<Record<string, unknown>[]>;

/** Like templateSqlRunner, returning the rows (doctor's read-only checks). */
export function templateSqlQuery(templateDir: string): QuerySql {
  return async (url, sql) => {
    const require = createRequire(path.join(templateDir, "package.json"));
    const pg = require("pg") as {
      Client: new (config: {
        connectionString: string;
        connectionTimeoutMillis: number;
      }) => PgClient;
    };
    const client = new pg.Client({
      connectionString: url,
      connectionTimeoutMillis: 10_000,
    });
    await client.connect();
    try {
      const result = (await client.query(sql)) as {
        rows: Record<string, unknown>[];
      };
      return result.rows;
    } finally {
      await client.end();
    }
  };
}
