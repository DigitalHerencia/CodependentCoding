import { randomBytes } from "node:crypto";

import {
  APP_ROLE,
  appRoleSql,
  databaseUrls,
  type RunSql,
  withCredentials,
} from "#cli/setup/database";
import { writeEnvLocal } from "#cli/setup/envFile";

export interface ConnectDatabaseOptions {
  appDir: string;
  /** The owner's connection string, pooled or direct, as Neon shows it. */
  connectionString: string;
  runSql: RunSql;
  password?: () => string;
}

/**
 * Wires a pasted connection string into .env.local without `--provision`:
 * creates `app_user` (NOBYPASSRLS) as the string's owner role, then writes
 * DATABASE_URL (app_user, pooled) and DIRECT_DATABASE_URL (owner, direct,
 * which Prisma migrates with).
 */
export async function connectDatabase({
  appDir,
  connectionString,
  runSql,
  password,
}: ConnectDatabaseOptions): Promise<void> {
  const { pooled, direct } = databaseUrls(connectionString);
  const owner = decodeURIComponent(new URL(direct).username);
  const secret = (password ?? (() => randomBytes(24).toString("hex")))();
  await runSql(direct, appRoleSql(secret, owner));
  writeEnvLocal(appDir, {
    DATABASE_URL: withCredentials(pooled, APP_ROLE, secret),
    DIRECT_DATABASE_URL: direct,
  });
}
