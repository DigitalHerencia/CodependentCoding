#!/usr/bin/env node
/**
 * Plans (and with --apply performs) the env sync for /ship: every variable in
 * the app's .env.example that is set in .env.local goes to Vercel production,
 * except test-only ones. Prints names only; values travel on stdin to
 * `vercel env add`, never in argv or output.
 *
 *   node scripts/ship-env.mjs [appDir]           dry run, exit 1 if a required name is unset
 *   node scripts/ship-env.mjs [appDir] --apply   also runs `vercel env add` per name
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Test-only variables stay on the developer's machine (DATABASE_URL_TEST, AUTH_WEBHOOK_DB_TEST, ...). */
export const LOCAL_ONLY = /(^|_)TEST(_|$)/;

function unquote(value) {
  const trimmed = value.trim();
  return /^(["']).*\1$/.test(trimmed) ? trimmed.slice(1, -1) : trimmed;
}

/** .env.example → [{ name, required }] from the `# required:` / `# optional:` line above each name. */
export function readExample(text) {
  const vars = [];
  let required = false;
  for (const line of text.split(/\r?\n/)) {
    const note = /^#\s*(required|optional):/.exec(line);
    if (note) required = note[1] === "required";
    const entry = /^([A-Z][A-Z0-9_]*)=/.exec(line);
    if (entry) {
      vars.push({ name: entry[1], required });
      required = false;
    }
  }
  return vars;
}

/** .env.local → Map of names with a non-blank value. */
export function readLocal(text) {
  const values = new Map();
  for (const line of text.split(/\r?\n/)) {
    const entry = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/.exec(
      line,
    );
    if (!entry) continue;
    const value = unquote(entry[2]);
    if (value !== "") values.set(entry[1], value);
  }
  return values;
}

export function planEnv(appDir) {
  const example = path.join(appDir, ".env.example");
  if (!existsSync(path.join(appDir, "hipster.json")) || !existsSync(example)) {
    throw new Error(
      `${appDir}: not a generated app (no hipster.json or .env.example)`,
    );
  }
  const localFile = path.join(appDir, ".env.local");
  const local = existsSync(localFile)
    ? readLocal(readFileSync(localFile, "utf8"))
    : new Map();
  const plan = { push: [], localOnly: [], unset: [], missingRequired: [] };
  for (const { name, required } of readExample(readFileSync(example, "utf8"))) {
    if (LOCAL_ONLY.test(name)) plan.localOnly.push(name);
    else if (local.has(name)) plan.push.push(name);
    else if (required) plan.missingRequired.push(name);
    else plan.unset.push(name);
  }
  return { plan, local };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const appDir = path.resolve(args.find((arg) => !arg.startsWith("--")) ?? ".");
  const { plan, local } = planEnv(appDir);
  const out = (line) => process.stdout.write(`${line}\n`);
  out(
    `push to Vercel production (${plan.push.length}): ${plan.push.join(", ") || "none"}`,
  );
  out(
    `kept local, test only (${plan.localOnly.length}): ${plan.localOnly.join(", ") || "none"}`,
  );
  out(
    `optional and unset (${plan.unset.length}): ${plan.unset.join(", ") || "none"}`,
  );
  if (plan.missingRequired.length > 0) {
    process.stderr.write(
      `required but unset in .env.local: ${plan.missingRequired.join(", ")}\n`,
    );
    process.exit(1);
  }
  if (!apply) {
    out(
      "DRY RUN: rerun with --apply to run `vercel env add` for each pushed name.",
    );
    process.exit(0);
  }
  for (const name of plan.push) {
    const run = spawnSync(
      "vercel",
      [
        "env",
        "add",
        name,
        "--environment",
        "production",
        "--sensitive",
        "--force",
        "--yes",
      ],
      {
        cwd: appDir,
        input: local.get(name),
        encoding: "utf8",
        shell: process.platform === "win32",
      },
    );
    if (run.status !== 0) {
      process.stderr.write(
        `vercel env add ${name} failed (exit ${run.status})\n`,
      );
      process.exit(1);
    }
    out(`set ${name}`);
  }
}
