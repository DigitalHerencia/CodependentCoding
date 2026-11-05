import path from "node:path";
import { appRoot } from "./app-paths.mjs";
import { manifestPath } from "@codependent/generator/paths.mjs";
/**
 * Checks `hipster.modules.json` and keeps `hipster.modules.schema.json` in
 * step with the Zod schema.
 *
 *   node scripts/check-modules.mjs          validate; fail if the JSON Schema is stale
 *   node scripts/check-modules.mjs --write  validate and regenerate the JSON Schema (then `pnpm format`)
 */
import { readFileSync, writeFileSync } from "node:fs";

import {
  toJsonSchema,
  validateManifest,
} from "@codependent/generator/modules-schema.mjs";

const manifestLocation = manifestPath(appRoot);
const schemaPath = path.join(path.dirname(manifestLocation), "hipster.modules.schema.json");

const write = process.argv.includes("--write");
const failures = [];

const result = validateManifest(
  JSON.parse(readFileSync(manifestLocation, "utf8")),
);
if (!result.ok) failures.push(...result.errors);

const generated = toJsonSchema();
if (write) {
  writeFileSync(schemaPath, `${JSON.stringify(generated, null, 2)}\n`);
  process.stdout.write("wrote hipster.modules.schema.json\n");
} else {
  let current = null;
  try {
    current = JSON.parse(readFileSync(schemaPath, "utf8"));
  } catch {
    // reported below
  }
  if (JSON.stringify(current) !== JSON.stringify(generated)) {
    failures.push(
      "hipster.modules.schema.json is stale; run `node scripts/check-modules.mjs --write`",
    );
  }
}

if (failures.length > 0) {
  console.error("hipster.modules.json: invalid");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

if (result.ok) {
  const { modules, presets } = result.manifest;
  const domains = modules.filter((entry) => entry.kind === "domain").length;
  process.stdout.write(
    `hipster.modules.json: ok (${domains} domain, ${modules.length - domains} add-on, ${Object.keys(presets).length} presets)\n`,
  );
}
