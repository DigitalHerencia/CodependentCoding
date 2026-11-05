import { appRoot } from "./app-paths.mjs";
import { manifestPath } from "@codependent/generator/paths.mjs";
/**
 * Prints how many files each module owns and fails when a file is matched by
 * two modules (CC-MOD-003).
 *
 *   node scripts/check-ownership.mjs
 */
import { readFileSync } from "node:fs";

import { validateManifest } from "@codependent/generator/modules-schema.mjs";
import {
  listFiles,
  ownershipReport,
} from "@codependent/generator/ownership.mjs";

const root = appRoot;
const result = validateManifest(
  JSON.parse(readFileSync(manifestPath(root), "utf8")),
);
if (!result.ok) {
  console.error("hipster.modules.json: invalid; run pnpm check:modules");
  process.exit(1);
}

const { counts, ambiguous } = ownershipReport(listFiles(root), result.manifest);
const width = Math.max(...Object.keys(counts).map((id) => id.length));
const lines = Object.entries(counts).map(
  ([id, count]) => `  ${id.padEnd(width)}  ${count}`,
);
process.stdout.write(`ownership\n${lines.join("\n")}\n`);

if (ambiguous.length > 0) {
  console.error(`\n${ambiguous.length} file(s) matched by two modules:`);
  for (const { path, rule, candidates } of ambiguous) {
    console.error(`  ${path}  (${rule}: ${candidates.join(", ")})`);
  }
  process.exit(1);
}
