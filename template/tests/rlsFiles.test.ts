import { readFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "vitest";

import { rlsFiles, rlsSql } from "@/scripts/rls-sql.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const schemaDir = `${root}/prisma/schema`;

/** model name -> owner file, for every model: RLS is forced on every table (CC-RLS-001, ledger D-7). */
function schemaModels() {
  const owners = new Map<string, string>();
  for (const file of readdirSync(schemaDir)) {
    const owner = basename(file, ".prisma");
    const source = readFileSync(`${schemaDir}/${file}`, "utf8");
    for (const [, name] of source.matchAll(/^model (\w+) \{$/gm)) {
      owners.set(name ?? "", owner);
    }
  }
  return owners;
}

/** table -> owner file, from `ALTER TABLE "X" FORCE ROW LEVEL SECURITY`. */
function forcedTables() {
  const owners = new Map<string, string>();
  for (const file of rlsFiles(root)) {
    const owner = basename(file, ".sql");
    const source = readFileSync(file, "utf8");
    for (const [, table] of source.matchAll(
      /ALTER TABLE "(\w+)" FORCE ROW LEVEL SECURITY/g,
    )) {
      expect(owners.has(table ?? ""), `${table} forced twice`).toBe(false);
      owners.set(table ?? "", owner);
    }
  }
  return owners;
}

test("every table has forced RLS in its owner's file", () => {
  const models = schemaModels();
  expect(models.size).toBeGreaterThan(0);
  expect(Object.fromEntries(forcedTables())).toEqual(
    Object.fromEntries(models),
  );
});

test("identity.sql is applied first", () => {
  expect(basename(rlsFiles(root)[0] ?? "")).toBe("identity.sql");
});

test("the newest *_rls migration carries the current prisma/rls source", () => {
  // `pnpm db:rls` writes it; RLS never reaches a database another way (CC-MIG-001).
  const latest = readdirSync(`${root}/prisma/migrations`)
    .filter((name) => name.endsWith("_rls"))
    .sort()
    .at(-1);
  expect(latest, "no *_rls migration: run `pnpm db:rls`").toBeDefined();
  expect(
    readFileSync(`${root}/prisma/migrations/${latest}/migration.sql`, "utf8"),
    "prisma/rls changed without a migration: run `pnpm db:rls`",
  ).toBe(rlsSql(root));
});
