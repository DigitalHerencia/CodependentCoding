/**
 * Validated env per owner (CC-025). Fails when:
 *   - an owner's `env` entries in hipster.modules.json differ from the Zod
 *     schema in lib/env/<owner>.ts (names, required), or one exists without the other
 *   - `.env.example` is not what scripts/env-example.mjs renders
 *   - code outside lib/env/** and *.config.* reads the process environment
 *
 * Runs under tsx with the react-server condition because lib/env/* is
 * TypeScript and imports `server-only`:
 *   pnpm check:env
 */
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

import { renderEnvExample } from "./env-example.mjs";
import { validateManifest } from "./modules-schema.mjs";
import { listFiles } from "./ownership.mjs";

const root = path.resolve(import.meta.dirname, "..");
const result = validateManifest(
  JSON.parse(readFileSync(path.join(root, "hipster.modules.json"), "utf8")),
);
if (!result.ok) {
  console.error("hipster.modules.json: invalid; run pnpm check:modules");
  process.exit(1);
}
const { manifest } = result;
const failures = [];

const owners = [
  ["base", manifest.base.env],
  ...manifest.modules.map((entry) => [entry.id, entry.env]),
];
for (const [owner, env] of owners) {
  const file = path.join(root, "lib", "env", `${owner}.ts`);
  if (!existsSync(file)) {
    if (env.length > 0)
      failures.push(
        `${owner}: env declared but lib/env/${owner}.ts is missing`,
      );
    continue;
  }
  const exported = Object.values(await import(pathToFileURL(file).href)).find(
    (value) => value?.owner === owner && value.schema,
  );
  if (!exported) {
    failures.push(`lib/env/${owner}.ts: no defineEnv("${owner}", …) export`);
    continue;
  }
  const shape = exported.schema.shape;
  const declared = new Map(env.map((entry) => [entry.name, entry]));
  for (const name of Object.keys(shape)) {
    const entry = declared.get(name);
    if (!entry) {
      failures.push(
        `${owner}: ${name} is in lib/env/${owner}.ts but not in the manifest`,
      );
      continue;
    }
    const required = !shape[name].safeParse(undefined).success;
    if (required !== entry.required) {
      failures.push(
        `${owner}: ${name} is ${required ? "required" : "optional"} in lib/env/${owner}.ts but required: ${entry.required} in the manifest`,
      );
    }
  }
  for (const name of declared.keys()) {
    if (!(name in shape))
      failures.push(
        `${owner}: ${name} is in the manifest but not in lib/env/${owner}.ts`,
      );
  }
}

const envExample = path.join(root, ".env.example");
if (
  !existsSync(envExample) ||
  readFileSync(envExample, "utf8") !== renderEnvExample(manifest)
) {
  failures.push(".env.example is stale; run `node scripts/env-example.mjs`");
}

const allowed = (file) =>
  file.startsWith("lib/env/") || /(^|\/)[^/]*\.config\.[^/]+$/.test(file);
const code = /\.(?:[cm]?[jt]sx?)$/;
for (const file of listFiles(root)) {
  if (!code.test(file) || allowed(file) || !existsSync(path.join(root, file)))
    continue;
  const lines = readFileSync(path.join(root, file), "utf8").split("\n");
  lines.forEach((line, index) => {
    if (/\bprocess\.env\b/.test(line))
      failures.push(
        `${file}:${index + 1}: reads the process environment outside lib/env/`,
      );
  });
}

if (failures.length > 0) {
  console.error("env: invalid");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
process.stdout.write(
  `env: ok (${owners.filter(([, env]) => env.length > 0).length} owners)\n`,
);
