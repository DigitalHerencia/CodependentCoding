import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "vitest";
import { parse } from "yaml";

const repo = path.resolve(import.meta.dirname, "../..");
const json = (file: string) =>
  JSON.parse(readFileSync(path.join(repo, file), "utf8")) as Record<
    string,
    unknown
  >;

interface MarketplaceEntry {
  name: string;
  source: string;
}

test("the local marketplace lists loaded-vibes at its plugin directory", () => {
  const marketplace = json(".claude-plugin/marketplace.json");
  expect(marketplace.name).toBe("codependent-coding");
  const entries = marketplace.plugins as MarketplaceEntry[];
  expect(entries).toEqual([
    expect.objectContaining({
      name: "loaded-vibes",
      source: "./plugin/loaded-vibes",
    }),
  ]);
  for (const { name, source } of entries) {
    const manifest = json(path.join(source, ".claude-plugin/plugin.json"));
    expect(manifest).toMatchObject({
      name,
      version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
      description: expect.any(String),
    });
  }
});

test("references/doctrine.md is current and carries every CC rule", () => {
  const check = spawnSync(
    process.execPath,
    ["scripts/plugin-doctrine.mjs", "--check"],
    { cwd: repo, encoding: "utf8" },
  );
  expect(check.stderr).toBe("");
  expect(check.status).toBe(0);

  const doctrine = readFileSync(
    path.join(repo, "plugin/loaded-vibes/references/doctrine.md"),
    "utf8",
  );
  const { rules } = parse(
    readFileSync(path.join(repo, ".claude/contracts/validation.yaml"), "utf8"),
  ) as { rules: { id: string }[] };
  expect(rules.length).toBeGreaterThan(0);
  for (const { id } of rules) expect(doctrine).toContain(`| ${id} `);
  expect(doctrine).toContain("None of the above?");
});

test("the agents are read-only reviewers with a name and a trigger", () => {
  for (const name of ["reviewer", "verifier"]) {
    const text = readFileSync(
      path.join(repo, `plugin/loaded-vibes/agents/${name}.md`),
      "utf8",
    );
    const front = parse(/^---\n([\s\S]*?)\n---\n/.exec(text)?.[1] ?? "") as {
      name: string;
      description: string;
      tools: string;
    };
    expect(front.name).toBe(name);
    expect(front.description).toMatch(/^.{40,}Use /);
    const tools = front.tools.split(",").map((tool) => tool.trim());
    expect(tools).not.toContain("Edit");
    expect(tools).not.toContain("Write");
    expect(text).toContain("${CLAUDE_PLUGIN_ROOT}/");
  }
});
