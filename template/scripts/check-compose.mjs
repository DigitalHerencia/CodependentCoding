/**
 * Each add-on composes alone with base (CC-026): for every add-on, and for no
 * modules at all, compose into a temp dir, then `prisma generate` and
 * `tsc --noEmit` and `eslint` (doctrine, against the composed manifest) there,
 * using the template's node_modules.
 *
 *   node scripts/check-compose.mjs [module ...]   (default: every add-on, then blank)
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { compose } from "./compose.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(
  readFileSync(path.join(root, "hipster.modules.json"), "utf8"),
);
const requested = process.argv.slice(2);
const cases =
  requested.length > 0
    ? requested.map((id) => [id])
    : [
        ...manifest.modules
          .filter(({ kind }) => kind === "addon")
          .map(({ id }) => [id]),
        [],
      ];

// Each tool runs through node from its own package, not node_modules/.bin, whose
// entries are shell shims that execFile cannot start on Windows.
const tools = {
  prisma: "prisma/build/index.js",
  tsc: "typescript/bin/tsc",
  eslint: "eslint/bin/eslint.js",
};
const failures = [];
for (const selected of cases) {
  const label = selected.length > 0 ? selected.join("+") : "blank";
  const dir = mkdtempSync(path.join(tmpdir(), `compose-${label}-`));
  try {
    const { modules } = compose(root, dir, selected);
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(dir, "node_modules"),
      "junction",
    );
    const run = (tool, args) =>
      execFileSync(
        process.execPath,
        [path.join(root, "node_modules", tools[tool]), ...args],
        { cwd: dir, stdio: "pipe" },
      );
    run("prisma", ["generate"]);
    run("tsc", ["--noEmit", "--incremental", "false"]);
    run("eslint", [".", "--max-warnings=0"]);
    process.stdout.write(`ok    base + [${modules.join(", ")}]\n`);
  } catch (error) {
    const output =
      `${error.stdout ?? ""}${error.stderr ?? ""}`.trim() || String(error);
    failures.push(`${label}:\n${output}`);
    process.stdout.write(`FAIL  ${label}\n`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`\n${failure}`);
  process.exit(1);
}
