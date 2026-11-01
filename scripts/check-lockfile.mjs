/**
 * Fails when a pnpm lockfile is not a single YAML document that starts with
 * `lockfileVersion`. pnpm 12 writes a leading environment document when
 * `packageManager` is set (unless `pmOnFail: ignore`), and GitHub's dependency
 * graph reads only that first document, so it sees zero dependencies and
 * Dependabot goes blind.
 *
 *   node scripts/check-lockfile.mjs [lockfile ...]
 *
 * With no arguments it checks pnpm-lock.yaml and template/pnpm-lock.yaml.
 * No dependencies, so CI can run it before installing anything.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const DEFAULT_LOCKFILES = ["pnpm-lock.yaml", "template/pnpm-lock.yaml"];
/** A YAML document marker: `---` (start) or `...` (end) on a line of its own. */
const MARKER = /^(---|\.\.\.)(\s.*)?$/;
const CONTENT = /^(?!\s*(#|$))/;

/** Problems with one lockfile's text; empty when it is a single document. */
export function lockfileProblems(text) {
  const documents = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    if (MARKER.test(line)) {
      current = null;
      continue;
    }
    if (!CONTENT.test(line)) continue;
    if (current === null) {
      current = [];
      documents.push(current);
    }
    current.push(line);
  }
  const problems = [];
  if (documents.length !== 1) {
    problems.push(`has ${documents.length} YAML documents; expected exactly 1`);
  }
  const firstLine = documents[0]?.[0];
  if (!firstLine?.startsWith("lockfileVersion:")) {
    problems.push(
      `starts with ${JSON.stringify(firstLine ?? "")}; expected lockfileVersion`,
    );
  }
  return problems;
}

function main(files) {
  let failed = false;
  for (const file of files) {
    const full = path.resolve(root, file);
    const relative = path.relative(root, full);
    const label = relative.startsWith("..") ? full : relative;
    const problems = lockfileProblems(readFileSync(full, "utf8"));
    if (problems.length === 0) {
      console.log(`ok   ${label}`);
      continue;
    }
    failed = true;
    for (const problem of problems) console.error(`FAIL ${label}: ${problem}`);
  }
  if (failed) {
    console.error(
      "Set `pmOnFail: ignore` in that project's pnpm-workspace.yaml, delete the leading document and run `pnpm install`.",
    );
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args.length > 0 ? args : DEFAULT_LOCKFILES);
}
