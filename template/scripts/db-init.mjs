/**
 * Creates the database schema and its row-level security in one command.
 *
 * Fresh app (no migrations yet): `prisma migrate dev --name init`, then an
 * `rls` migration created with --create-only, filled with prisma/rls/*.sql and
 * applied, so RLS travels with the migration history.
 * Existing migrations (this template, or a later run): `prisma migrate deploy`,
 * then the same SQL through `prisma db execute`; the files are idempotent.
 *
 *   pnpm db:init
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { rlsFiles, rlsSql } from "./rls-sql.mjs";

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
  const cacheDir = join(root, "node_modules", ".cache");
  mkdirSync(cacheDir, { recursive: true });
  const file = join(cacheDir, "db-init-rls.sql");
  writeFileSync(file, sql);
  prisma("db", "execute", "--file", file);
}
process.stdout.write("db:init done\n");
