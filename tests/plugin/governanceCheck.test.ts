import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { afterAll, expect, test } from "vitest";

import { composeApp } from "@/packages/cli/src/compose/composeApp";
import {
  checkGovernance,
  CONTRACTS,
  DOCS,
} from "@/plugin/loaded-vibes/scripts/governance-check.mjs";

const templateDir = path.resolve(import.meta.dirname, "../../template");
// Inside template/ so the app resolves the template's Prettier, as an installed app would.
mkdirSync(path.join(templateDir, ".sandbox"), { recursive: true });
const sandbox = mkdtempSync(path.join(templateDir, ".sandbox", "idea-check-"));
afterAll(() => rmSync(sandbox, { recursive: true, force: true }));

async function app(name: string): Promise<string> {
  const outDir = path.join(sandbox, name);
  await composeApp({
    templateDir,
    outDir,
    modules: ["crm"],
    name,
    color: null,
    cliVersion: "0.0.0-test",
    now: new Date("2026-10-24T00:00:00Z"),
  });
  return outDir;
}

function rewrite(dir: string, file: string, change: (text: string) => string) {
  const full = path.join(dir, file);
  writeFileSync(full, change(readFileSync(full, "utf8")));
}

test("a fresh app reports the TODOs in every doc and contract", async () => {
  const problems = await checkGovernance(await app("fresh"));
  for (const file of [...CONTRACTS, ...DOCS]) {
    expect(problems.some((problem) => problem.startsWith(`${file}:`))).toBe(
      true,
    );
  }
  expect(problems.join("\n")).not.toContain("invalid YAML");
});

test("a filled app passes; broken YAML is reported", async () => {
  const dir = await app("filled");
  for (const file of CONTRACTS) {
    rewrite(dir, file, (text) =>
      text
        .replace(/^(\s*owner_shell:) TODO.*$/m, "$1 zsh")
        .replaceAll(" # TODO", ""),
    );
  }
  for (const file of DOCS) {
    rewrite(dir, file, (text) => text.replaceAll(/\bTODO\b/g, "Filled"));
  }
  expect(await checkGovernance(dir)).toEqual([]);

  rewrite(dir, CONTRACTS[0], (text) => `${text}goals: [unclosed\n`);
  const problems = await checkGovernance(dir);
  expect(problems).toHaveLength(1);
  expect(problems[0]).toMatch(
    /^\.claude\/contracts\/application\.yaml: invalid YAML/,
  );
});

test("refuses a directory that is not a generated app", async () => {
  expect(await checkGovernance(sandbox)).toEqual([
    `${sandbox}: not a generated app (no hipster.json)`,
  ]);
});
