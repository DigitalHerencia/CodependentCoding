import { readFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "vitest";

import { rlsFiles } from "@/scripts/rls-sql.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const schemaDir = `${root}/prisma/schema`;

/** model name -> owner file, for models that need RLS (required organizationId, plus User and Organization). */
function tenantModels() {
  const owners = new Map<string, string>();
  for (const file of readdirSync(schemaDir)) {
    const owner = basename(file, ".prisma");
    const source = readFileSync(`${schemaDir}/${file}`, "utf8");
    for (const [, name, body] of source.matchAll(
      /^model (\w+) \{\n([\s\S]*?)^\}/gm,
    )) {
      const tenant = /^\s+organizationId\s+String\s/m.test(body ?? "");
      if (tenant || name === "User" || name === "Organization") {
        owners.set(name ?? "", owner);
      }
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

test("every tenant table has forced RLS in its owner's file", () => {
  const models = tenantModels();
  expect(models.size).toBeGreaterThan(30);
  expect(Object.fromEntries(forcedTables())).toEqual(
    Object.fromEntries(models),
  );
});

test("identity.sql is applied first", () => {
  expect(basename(rlsFiles(root)[0] ?? "")).toBe("identity.sql");
});
