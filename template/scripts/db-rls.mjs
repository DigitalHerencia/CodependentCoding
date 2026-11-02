/**
 * Row-level security ships only as migrations (CC-MIG-001, ledger D-4).
 *
 *   pnpm db:rls          write prisma/rls/*.sql into a new <ts>_rls migration
 *                        (no-op when the newest *_rls migration already matches);
 *                        `pnpm db:init` applies it
 *   pnpm db:rls:check    compare the live pg_policies, RLS flags and role grants
 *                        with the source; exit 1 on drift (CI runs this)
 *
 * The check connects as the owner: DATABASE_URL_UNPOOLED, else DATABASE_URL
 * (the precedence prisma.config.ts uses).
 * It changes nothing: its work runs in a transaction that is rolled back.
 */
import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import pg from "pg";

import { rlsDrift, writeRlsMigration } from "./rls-sql.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

if (!process.argv.includes("--check")) {
  const name = writeRlsMigration(root);
  process.stdout.write(
    name
      ? `wrote prisma/migrations/${name}/migration.sql\n`
      : "RLS source unchanged since the newest *_rls migration\n",
  );
} else {
  config({ path: ".env.local", quiet: true });
  config({ quiet: true });
  // lib/env is the only reader of the environment (check:env); the owner's
  // direct URL first, whichever of the names this app declares.
  const { baseEnv } = await import("@/lib/env/base");
  const declared = Object.keys(baseEnv.schema.shape);
  const url = ["DATABASE_URL_UNPOOLED", "DATABASE_URL"]
    .filter((name) => declared.includes(name))
    .map((name) => baseEnv.value(name))
    .find(Boolean);
  if (!url) {
    process.stderr.write("db:rls:check needs the owner's database URL.\n");
    process.exit(1);
  }
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    const drift = await rlsDrift(client, root);
    if (drift.length > 0) {
      process.stderr.write(
        `pg_policies differ from prisma/rls (run \`pnpm db:rls\`):\n${drift.join("\n")}\n`,
      );
      process.exitCode = 1;
    } else {
      process.stdout.write(
        "pg_policies, RLS flags and role grants match prisma/rls\n",
      );
    }
  } finally {
    await client.end();
  }
}
