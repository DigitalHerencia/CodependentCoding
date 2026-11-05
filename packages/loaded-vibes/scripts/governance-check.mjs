#!/usr/bin/env node
/**
 * Checks a generated app's governance after /idea: the three contracts are
 * valid YAML and no TODO is left in the app-owned docs and contracts.
 * YAML is parsed with the app's own Prettier, so the plugin needs no install.
 *
 *   node scripts/governance-check.mjs [appDir]   exit 1 on any problem
 */
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const CONTRACTS = [
  ".claude/contracts/application.yaml",
  ".claude/contracts/validation.yaml",
  ".claude/contracts/design.yaml",
];
export const DOCS = [
  "context/docs/PRD.md",
  "context/docs/tech-requirements.md",
  "context/docs/Architecture.md",
  "context/docs/Design.md",
  "context/docs/AUTH.md",
];

async function loadPrettier(appDir) {
  const require = createRequire(path.join(appDir, "package.json"));
  const prettier = await import(
    pathToFileURL(require.resolve("prettier")).href
  );
  // The CommonJS entry arrives as a default export.
  return prettier.format ? prettier : prettier.default;
}

/** Problems as "<file>: <what>"; empty when the app is ready for /plan. */
export async function checkGovernance(appDir) {
  if (!existsSync(path.join(appDir, "hipster.json"))) {
    return [`${appDir}: not a generated app (no hipster.json)`];
  }
  const prettier = await loadPrettier(appDir);
  const problems = [];
  for (const file of [...CONTRACTS, ...DOCS]) {
    const full = path.join(appDir, file);
    if (!existsSync(full)) {
      problems.push(`${file}: missing`);
      continue;
    }
    const text = readFileSync(full, "utf8");
    if (file.endsWith(".yaml")) {
      try {
        await prettier.format(text, { parser: "yaml" });
      } catch (error) {
        problems.push(`${file}: invalid YAML: ${error.message.split("\n")[0]}`);
      }
    }
    // HTML comments are instructions to the filler, not content.
    const content = text.replace(/<!--[\s\S]*?-->/g, (comment) =>
      comment.replace(/[^\n]/g, ""),
    );
    content.split("\n").forEach((line, index) => {
      if (/\bTODO\b/.test(line)) {
        problems.push(`${file}:${index + 1}: TODO left: ${line.trim()}`);
      }
    });
  }
  return problems;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const appDir = path.resolve(process.argv[2] ?? ".");
  const problems = await checkGovernance(appDir);
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    console.error(`\n${problems.length} problem(s). Fill them, then rerun.`);
    process.exit(1);
  }
  console.log("governance ok: 3 contracts parse, no TODO in docs or contracts");
}
