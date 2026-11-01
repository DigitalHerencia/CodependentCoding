/**
 * Creates the database schema and its row-level security in one command.
 *
 * Fresh app (no migrations yet): `prisma migrate dev --name init`, then an
 * `rls` migration created with --create-only, filled with prisma/rls/*.sql and
 * applied, so RLS travels with the migration history.
 * Existing migrations (this template, or a later run): `prisma migrate deploy`;
 * when prisma/rls/*.sql changed since the newest `*_rls` migration, a new one is
 * written (as `pnpm db:rls` does) and deployed. No SQL runs outside migration
 * history (CC-MIG-001).
 *
 *   pnpm db:init
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { rlsFiles, rlsSql, writeRlsMigration } from "./rls-sql.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const migrationsDir = join(root, "prisma", "migrations");

function prisma(...args) {
  execFileSync("pnpm", ["exec", "prisma", ...args], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

function migrations() {
  if (!existsSync(migrationsDir)) return [];
  return readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

const sql = rlsSql(root);
process.stdout.write(
  `RLS from ${rlsFiles(root)
    .map((file) => file.slice(root.length))
    .join(", ")}\n`,
);

if (migrations().length === 0) {
  prisma("migrate", "dev", "--name", "init");
  prisma("migrate", "dev", "--create-only", "--name", "rls");
  const rls = migrations().find((name) => name.endsWith("_rls"));
  if (!rls) throw new Error("prisma did not create the rls migration");
  writeFileSync(join(migrationsDir, rls, "migration.sql"), sql);
  prisma("migrate", "dev");
} else {
  prisma("migrate", "deploy");
  const rls = writeRlsMigration(root);
  if (rls) {
    process.stdout.write(`wrote prisma/migrations/${rls}/migration.sql\n`);
    prisma("migrate", "deploy");
  }
}
process.stdout.write("db:init done\n");
