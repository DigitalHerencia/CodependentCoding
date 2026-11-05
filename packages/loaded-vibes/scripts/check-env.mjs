import { appRoot } from "./app-paths.mjs";
import { manifestPath } from "@codependent/generator/paths.mjs";
/**
 * Validated env per owner (CC-025). Fails when:
 *   - an owner's `env` entries in hipster.modules.json differ from the Zod
 *     schema in lib/utils/env.ts or lib/integrations/<provider>/env.ts (names, required), or one exists without the other
 *   - `.env.example` is not what scripts/env-example.mjs renders
 *   - code outside the environment utilities and *.config.* reads the process environment
 *
 * Runs under tsx with the react-server condition because the environment utilities are
 * TypeScript and imports `server-only`:
 *   pnpm check:env
 */
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

import { renderEnvExample } from "@codependent/generator/env-example.mjs";
import { validateManifest } from "@codependent/generator/modules-schema.mjs";
import { listFiles } from "@codependent/generator/ownership.mjs";

const root = appRoot;
const result = validateManifest(
  JSON.parse(readFileSync(manifestPath(root), "utf8")),
);
if (!result.ok) {
  console.error("hipster.modules.json: invalid; run pnpm check:modules");
  process.exit(1);
}
const { manifest } = result;
const failures = [];

const envFiles = {
  base: "lib/utils/env.ts",
  billing: "lib/integrations/stripe/env.ts",
  email: "lib/integrations/sendgrid/env.ts",
  inference: "lib/integrations/hugging-face/env.ts",
  media: "lib/integrations/cloudinary/env.ts",
  ratelimit: "lib/integrations/upstash/env.ts",
  uploads: "lib/integrations/vercel-blob/env.ts",
};
const owners = [
  ["base", manifest.base.env],
  ...manifest.modules.map((entry) => [entry.id, entry.env]),
];
for (const [owner, env] of owners) {
  const relativeFile = envFiles[owner];
  const file = relativeFile ? path.join(root, relativeFile) : undefined;
  if (!file || !existsSync(file)) {
    if (env.length > 0)
      failures.push(
        `${owner}: env declared but ${relativeFile ?? owner} is missing`,
      );
    continue;
  }
  const exported = Object.values(await import(pathToFileURL(file).href)).find(
    (value) => value?.owner === owner && value.schema,
  );
  if (!exported) {
    failures.push(
      `${relativeFile ?? owner}: no defineEnv("${owner}", …) export`,
    );
    continue;
  }
  const shape = exported.schema.shape;
  const declared = new Map(env.map((entry) => [entry.name, entry]));
  for (const name of Object.keys(shape)) {
    const entry = declared.get(name);
    if (!entry) {
      failures.push(
        `${owner}: ${name} is in ${relativeFile ?? owner} but not in the manifest`,
      );
      continue;
    }
    const required = !shape[name].safeParse(undefined).success;
    if (required !== entry.required) {
      failures.push(
        `${owner}: ${name} is ${required ? "required" : "optional"} in ${relativeFile ?? owner} but required: ${entry.required} in the manifest`,
      );
    }
  }
  for (const name of declared.keys()) {
    if (!(name in shape))
      failures.push(
        `${owner}: ${name} is in the manifest but not in ${relativeFile ?? owner}`,
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
  ["lib/utils/env.ts", "lib/constants/mode.ts"].includes(file) ||
  /(^|\/)[^/]*\.config\.[^/]+$/.test(file);
const code = /\.(?:[cm]?[jt]sx?)$/;
for (const file of listFiles(root)) {
  if (!code.test(file) || allowed(file) || !existsSync(path.join(root, file)))
    continue;
  const lines = readFileSync(path.join(root, file), "utf8").split("\n");
  lines.forEach((line, index) => {
    if (/\bprocess\.env\b/.test(line))
      failures.push(
        `${file}:${index + 1}: reads the process environment outside the environment utilities`,
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
