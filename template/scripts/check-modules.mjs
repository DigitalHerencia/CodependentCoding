/**
 * Checks `hipster.modules.json` and keeps `hipster.modules.schema.json` in
 * step with the Zod schema.
 *
 *   node scripts/check-modules.mjs          validate; fail if the JSON Schema is stale
 *   node scripts/check-modules.mjs --write  validate and regenerate the JSON Schema (then `pnpm format`)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { toJsonSchema, validateManifest } from "./modules-schema.mjs";

const manifestPath = fileURLToPath(
  new URL("../hipster.modules.json", import.meta.url),
);
const schemaPath = fileURLToPath(
  new URL("../hipster.modules.schema.json", import.meta.url),
);

const write = process.argv.includes("--write");
const failures = [];

const result = validateManifest(JSON.parse(readFileSync(manifestPath, "utf8")));
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
