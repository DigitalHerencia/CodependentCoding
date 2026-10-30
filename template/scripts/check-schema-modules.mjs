/**
 * For every module with a `prisma/schema/<id>.prisma` file, removes that file,
 * the files of modules that depend on it, and every line tagged
 * `// @module <removed id>`, then runs `prisma validate` on what is left.
 * This is what the CLI does when a module is not selected (FR-MOD-4).
 *
 *   node scripts/check-schema-modules.mjs
 */
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { validateManifest } from "./modules-schema.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const prisma = join(root, "node_modules", "prisma", "build", "index.js");
const schemaDir = join(root, "prisma/schema");
const result = validateManifest(
  JSON.parse(readFileSync(join(root, "hipster.modules.json"), "utf8")),
);
if (!result.ok) {
  console.error("hipster.modules.json: invalid; run pnpm check:modules");
  process.exit(1);
}
const { modules } = result.manifest;

/** The module plus everything that depends on it, directly or not. */
function removalSet(id) {
  const removed = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const entry of modules) {
      if (
        !removed.has(entry.id) &&
        entry.dependsOn.some((dep) => removed.has(dep))
      ) {
        removed.add(entry.id);
        grew = true;
      }
    }
  }
  return removed;
}

function strip(dir, removed) {
  for (const file of readdirSync(dir)) {
    const id = file.replace(/\.prisma$/, "");
    if (removed.has(id)) {
      rmSync(join(dir, file));
      continue;
    }
    const source = readFileSync(join(dir, file), "utf8");
    const kept = source
      .split("\n")
      .filter((line) => {
        const tag = /\/\/ @module (\w+)\s*$/.exec(line);
        return !(tag && removed.has(tag[1]));
      })
      .join("\n");
    writeFileSync(join(dir, file), kept);
  }
}

const failures = [];
const withSchema = modules.filter(({ id }) =>
  existsSync(join(schemaDir, `${id}.prisma`)),
);
// Each module on its own, then every module at once (the blank preset).
const cases = [
  ...withSchema.map(({ id }) => removalSet(id)),
  new Set(modules.map(({ id }) => id)),
];
for (const removed of cases) {
  const id = [...removed][0];
  const dir = mkdtempSync(join(tmpdir(), `schema-${id}-`));
  try {
    cpSync(schemaDir, dir, { recursive: true });
    strip(dir, removed);
    // node + prisma's entry rather than `pnpm`, which is a .cmd shim on Windows.
    execFileSync(process.execPath, [prisma, "validate", "--schema", dir], {
      cwd: root,
      stdio: "pipe",
    });
    process.stdout.write(`ok    without ${[...removed].join(", ")}\n`);
  } catch (error) {
    const output = `${error.stdout ?? ""}${error.stderr ?? ""}`.trim();
    failures.push(`without ${[...removed].join(", ")}:\n${output}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL  ${failure}`);
  process.exit(1);
}
process.stdout.write(
  `schema validates with each of ${withSchema.length} modules removed, and with none installed\n`,
);
