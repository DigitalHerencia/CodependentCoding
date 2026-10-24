#!/usr/bin/env node
/**
 * Runs a generated app's ESLint once and groups the findings by doctrine rule
 * (the `[CC-*]` prefix of the message; other rules by their ESLint id), so
 * /check fixes one cause at a time. Uses the app's own ESLint and config.
 *
 *   node scripts/lint-findings.mjs [appDir]   exit 1 when anything is found
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SHOWN = 5;

/** ESLint JSON results → [{ id, findings: [{ file, line, message }] }], largest group first. */
export function groupFindings(results, appDir) {
  const groups = new Map();
  for (const { filePath, messages } of results) {
    const file = path.relative(appDir, filePath).split(path.sep).join("/");
    for (const { ruleId, message, line } of messages) {
      const id =
        /^\[(CC-[A-Z]+-\d{3})\]/.exec(message)?.[1] ?? ruleId ?? "parse";
      const list = groups.get(id) ?? [];
      list.push({ file, line: line ?? 0, message });
      groups.set(id, list);
    }
  }
  return [...groups]
    .map(([id, findings]) => ({ id, findings }))
    .sort(
      (a, b) =>
        b.findings.length - a.findings.length || a.id.localeCompare(b.id),
    );
}

export function lintApp(appDir) {
  let eslint;
  try {
    const require = createRequire(path.join(appDir, "package.json"));
    eslint = path.join(
      path.dirname(require.resolve("eslint/package.json")),
      "bin/eslint.js",
    );
  } catch {
    throw new Error(`${appDir}: ESLint is not installed (run pnpm install)`);
  }
  const run = spawnSync(process.execPath, [eslint, ".", "--format", "json"], {
    cwd: appDir,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  if (run.status !== 0 && run.status !== 1) {
    throw new Error(`eslint exited ${run.status}: ${run.stderr.trim()}`);
  }
  return groupFindings(JSON.parse(run.stdout), appDir);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const appDir = path.resolve(process.argv[2] ?? ".");
  const groups = lintApp(appDir);
  const total = groups.reduce((sum, { findings }) => sum + findings.length, 0);
  if (total === 0) {
    process.stdout.write("lint: 0 findings\n");
    process.exit(0);
  }
  const lines = [`lint: ${total} finding(s) in ${groups.length} group(s)`];
  for (const { id, findings } of groups) {
    lines.push("", `${id} (${findings.length})`);
    for (const { file, line, message } of findings.slice(0, SHOWN)) {
      lines.push(`  ${file}:${line}  ${message}`);
    }
    if (findings.length > SHOWN)
      lines.push(`  … ${findings.length - SHOWN} more`);
  }
  process.stdout.write(`${lines.join("\n")}\n`);
  process.exit(1);
}
