import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { afterAll, beforeAll, expect, test } from "vitest";

import { composeApp } from "@/packages/cli/src/compose/composeApp";
import { labelsOf, loadIssues } from "@/template/scripts/sync-issues.mjs";

const templateDir = path.resolve(import.meta.dirname, "../../template");
mkdirSync(path.join(templateDir, ".sandbox"), { recursive: true });
const sandbox = mkdtempSync(path.join(templateDir, ".sandbox", "plan-"));
const appDir = path.join(sandbox, "app");
const issuesDir = path.join(appDir, "context/specs/issues");

function issue(
  id: string,
  fields: Record<string, string> = {},
  body = "## Summary\n\nS.\n\n## Scope\n\n- [ ] x\n\n## Acceptance criteria\n\n- [ ] `pnpm test` exits 0\n",
): string {
  const front = {
    id,
    title: `"Issue ${id}"`,
    type: "feature",
    area: "field",
    milestone: '"M1 · MVP"',
    priority: "p0",
    size: "m",
    depends_on: "[]",
    status: "todo",
    ...fields,
  };
  const lines = Object.entries(front)
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}: ${value}`);
  return `---\n${lines.join("\n")}\n---\n\n# ${id} · Issue\n\n${body}`;
}

function write(files: Record<string, string>) {
  rmSync(issuesDir, { recursive: true, force: true });
  mkdirSync(issuesDir, { recursive: true });
  for (const [name, text] of Object.entries(files)) {
    writeFileSync(path.join(issuesDir, name), text);
  }
}

const sync = () =>
  spawnSync(process.execPath, ["scripts/sync-issues.mjs"], {
    cwd: appDir,
    encoding: "utf8",
  });

beforeAll(async () => {
  await composeApp({
    templateDir,
    outDir: appDir,
    modules: ["crm"],
    name: "greenroute",
    color: null,
    cliVersion: "0.0.0-test",
    now: new Date("2026-10-24T00:00:00Z"),
  });
  // Its own repository without a remote: the dry run stays offline.
  execFileSync("git", ["init", "-q"], { cwd: appDir });
});
afterAll(() => rmSync(sandbox, { recursive: true, force: true }));

test("generated apps ship the sync script and the issues:sync script", () => {
  const pkg = JSON.parse(
    readFileSync(path.join(appDir, "package.json"), "utf8"),
  ) as { scripts: Record<string, string> };
  expect(pkg.scripts["issues:sync"]).toBe("node scripts/sync-issues.mjs");
  expect(readFileSync(path.join(issuesDir, "README.md"), "utf8")).toContain(
    "pnpm issues:sync --apply",
  );
});

test("valid issues pass the dry run, with labels derived when absent", () => {
  write({
    "README.md": "# Issues\n",
    "GR-001-property-slice.md": issue("GR-001"),
    "GR-002-visit-slice.md": issue("GR-002", {
      depends_on: "[GR-001]",
      labels: "[type:feature, area:field]",
    }),
  });
  const { issues, problems } = loadIssues(issuesDir);
  expect(problems).toEqual([]);
  expect(issues.map(({ id }) => id)).toEqual(["GR-001", "GR-002"]);
  expect(issues[0]?.milestone).toBe("M1 · MVP");
  expect(labelsOf(issues[0]!)).toEqual([
    "type:feature",
    "area:field",
    "priority:p0",
    "size:m",
  ]);
  expect(labelsOf(issues[1]!)).toEqual(["type:feature", "area:field"]);

  const run = sync();
  expect(run.status).toBe(0);
  expect(run.stdout).toContain("DRY RUN · no GitHub remote · 2 issues valid");
  expect(run.stdout).toContain("GR-002 · Issue GR-002");
});

test("the dry run names every problem and exits 1", () => {
  write({
    "GR-001-bad.md": issue("GR-003", { type: "story", size: "" }),
    "GR-002-dup.md": issue("GR-002", { depends_on: "[GR-009]" }, "## Scope\n"),
    "notes.md": "free text",
  });
  const { problems } = loadIssues(issuesDir);
  expect(problems).toEqual([
    "GR-001-bad.md: size is required",
    'GR-001-bad.md: type "story" is not one of feature, fix, chore, refactor, test, docs, ci, spike',
    "GR-001-bad.md: id GR-003 does not match the file name",
    'GR-002-dup.md: missing "## Summary"',
    'GR-002-dup.md: missing "## Acceptance criteria"',
    "notes.md: name must be <PREFIX>-NNN-<slug>.md",
    "GR-002-dup.md: depends_on GR-009 has no issue file",
  ]);
  const run = sync();
  expect(run.status).toBe(1);
  expect(run.stderr).toContain("7 problem(s) in context/specs/issues.");
});
