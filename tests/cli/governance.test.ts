import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "vitest";

import {
  GOVERNANCE_DIR,
  governanceFiles,
  renderGovernance,
} from "@/packages/cli/src/compose/governance";

const repo = path.resolve(import.meta.dirname, "../..");
const vars = {
  appName: "demo",
  modules: ["crm"],
  color: "#1d4f5c",
  templateCommit: "abc123",
  now: new Date("2026-10-23T00:00:00Z"),
};
const asset = (file: string) =>
  readFileSync(path.join(GOVERNANCE_DIR, file), "utf8");

test("ships the full governance shape", () => {
  expect(governanceFiles()).toEqual([
    ".claude/contracts/application.yaml",
    ".claude/contracts/design.yaml",
    ".claude/contracts/validation.yaml",
    ".claude/execution/decisions.json",
    ".claude/execution/handoff.json",
    ".claude/execution/progress.json",
    ".claude/settings.json",
    "CLAUDE.md",
    "context/docs/AUTH.md",
    "context/docs/Architecture.md",
    "context/docs/Design.md",
    "context/docs/PRD.md",
    "context/docs/tech-requirements.md",
    "context/specs/issues/README.md",
  ]);
});

test("every placeholder renders; JSON stays JSON", () => {
  for (const file of governanceFiles()) {
    const rendered = renderGovernance(asset(file), vars);
    expect(rendered, file).not.toMatch(/\{\{\w+\}\}/);
    if (file.endsWith(".json"))
      expect(() => JSON.parse(rendered)).not.toThrow();
  }
  expect(() => renderGovernance("{{nope}}", vars)).toThrow(
    /unknown placeholder/,
  );
});

test("CLAUDE.md stays within 60 lines", () => {
  expect(asset("CLAUDE.md").trimEnd().split("\n").length).toBeLessThanOrEqual(
    60,
  );
});

test("Architecture.md lists every doctrine rule ID the lint enforces", () => {
  const ids = new Set(
    ["doctrine-map.mjs", "codependent-plugin.mjs"].flatMap((file) =>
      [
        ...readFileSync(
          path.join(repo, "template/eslint", file),
          "utf8",
        ).matchAll(/CC-[A-Z]+-\d{3}/g),
      ].map(([id]) => id),
    ),
  );
  expect(ids.size).toBeGreaterThan(20);
  const architecture = asset("context/docs/Architecture.md");
  expect([...ids].filter((id) => !architecture.includes(id))).toEqual([]);
});

test("doctrine docs carry no factory-only paths", () => {
  for (const file of ["Architecture.md", "AUTH.md", "Design.md"]) {
    expect(asset(`context/docs/${file}`), file).not.toMatch(
      /template\/|\(DEC-\d+\)/,
    );
  }
});

test("skills may write .claude in headless and auto-accept runs", () => {
  const settings = JSON.parse(asset(".claude/settings.json")) as {
    permissions: { allow: string[] };
  };
  expect(settings.permissions.allow).toEqual(
    expect.arrayContaining(["Edit(.claude/**)", "Write(.claude/**)"]),
  );
  expect(settings.permissions.allow).not.toContain(
    "Bash(pnpm issues:sync --apply)",
  );
});

test("progress.json spells out the one record format every skill writes", () => {
  const progress = JSON.parse(
    renderGovernance(asset(".claude/execution/progress.json"), vars),
  ) as { format: { statuses: string[]; evidence: string } };
  expect(progress.format.statuses).toEqual([
    "todo",
    "in-progress",
    "in-review",
    "done",
    "blocked",
  ]);
  expect(progress.format.evidence).toContain(
    "{ date: YYYY-MM-DD, state, command, result }",
  );
});
