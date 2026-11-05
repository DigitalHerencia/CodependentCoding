import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../../", import.meta.url));
test("Maximal Template contains application code and no factory assets", () => {
  const template = path.join(root, "packages/maximal-template");
  assert.ok(
    existsSync(path.join(template, "app/layout.tsx")),
    "application is packaged",
  );
  for (const file of [
    "scripts",
    "eslint",
    ".claude",
    "context",
    "hipster.modules.json",
    "hipster.modules.schema.json",
    "tests/template",
  ]) {
    assert.equal(existsSync(path.join(template, file)), false, file);
  }
  const pkg = JSON.parse(
    readFileSync(path.join(template, "package.json"), "utf8"),
  );
  for (const name of [
    "db:init",
    "db:rls",
    "db:rls:check",
    "issues:sync",
    "check:modules",
    "check:ownership",
    "check:env",
    "check:compose",
    "check:schema-modules",
    "doctrine:test",
  ])
    assert.equal(name in pkg.scripts, false, name);
});
