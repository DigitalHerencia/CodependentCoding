import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { afterAll, beforeAll, expect, test } from "vitest";

import { composeApp } from "@/packages/cli/src/compose/composeApp";
import {
  groupFindings,
  lintApp,
} from "@/plugin/loaded-vibes/scripts/lint-findings.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const pluginDir = path.join(repo, "plugin/loaded-vibes");
const templateDir = path.join(repo, "template");
mkdirSync(path.join(templateDir, ".sandbox"), { recursive: true });
const sandbox = mkdtempSync(path.join(templateDir, ".sandbox", "hooks-"));
const appDir = path.join(sandbox, "app");
const otherDir = path.join(sandbox, "unrelated");

const LEAK =
  'import { prisma } from "@/lib/db/client";\n\nexport async function Leak() {\n  const rows = await prisma.organization.findMany();\n  return <p>{rows.length}</p>;\n}\n';

function commitAll(dir: string) {
  execFileSync("git", ["add", "-A"], { cwd: dir });
  execFileSync(
    "git",
    [
      "-c",
      "user.email=t@example.com",
      "-c",
      "user.name=t",
      "commit",
      "-qm",
      "init",
    ],
    { cwd: dir },
  );
}

/** Runs a hook as Claude Code does: command from hooks.json, event JSON on stdin. */
function fire(
  event: "PostToolUse" | "Stop",
  projectDir: string,
  input: object,
) {
  const hooks = JSON.parse(
    readFileSync(path.join(pluginDir, "hooks/hooks.json"), "utf8"),
  ) as { hooks: Record<string, { hooks: { command: string }[] }[]> };
  const command = hooks.hooks[event]![0]!.hooks[0]!.command.replaceAll(
    "${CLAUDE_PLUGIN_ROOT}",
    pluginDir,
  );
  return spawnSync(command, {
    shell: true,
    cwd: projectDir,
    input: JSON.stringify(input),
    encoding: "utf8",
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
  });
}

beforeAll(async () => {
  await composeApp({
    templateDir,
    outDir: appDir,
    modules: ["crm"],
    name: "hooks",
    color: null,
    cliVersion: "0.0.0-test",
    now: new Date("2026-10-24T00:00:00Z"),
  });
  // An installed app has its own node_modules; the template's stands in for it.
  symlinkSync(
    path.join(templateDir, "node_modules"),
    path.join(appDir, "node_modules"),
    "dir",
  );
  execFileSync("git", ["init", "-q"], { cwd: appDir });
  commitAll(appDir);

  mkdirSync(otherDir);
  writeFileSync(
    path.join(otherDir, "package.json"),
    '{ "name": "unrelated" }\n',
  );
  execFileSync("git", ["init", "-q"], { cwd: otherDir });
  commitAll(otherDir);
});
afterAll(() => rmSync(sandbox, { recursive: true, force: true }));

test("the plugin hooks are the factory hooks, unchanged", () => {
  for (const hook of ["lint-edited-file.mjs", "execution-state-guard.mjs"]) {
    expect(readFileSync(path.join(pluginDir, "hooks", hook), "utf8")).toBe(
      readFileSync(path.join(repo, ".claude/hooks", hook), "utf8"),
    );
  }
});

test("the lint hook reports CC findings in a generated app and stays silent elsewhere", () => {
  for (const dir of [appDir, otherDir]) {
    mkdirSync(path.join(dir, "features/crm"), { recursive: true });
    writeFileSync(path.join(dir, "features/crm/leakFeature.tsx"), LEAK);
  }
  const input = { tool_input: { file_path: "features/crm/leakFeature.tsx" } };

  const inApp = fire("PostToolUse", appDir, input);
  expect(inApp.status).toBe(2);
  expect(inApp.stderr).toContain("[CC-FEAT-001]");

  const elsewhere = fire("PostToolUse", otherDir, input);
  expect(elsewhere.status).toBe(0);
  expect(elsewhere.stderr).toBe("");

  const groups = lintApp(appDir);
  expect(groups.map(({ id }) => id)).toEqual(["CC-FEAT-001"]);
  expect(groups[0]?.findings[0]).toMatchObject({
    file: "features/crm/leakFeature.tsx",
    line: 1,
  });
}, 240_000);

test("the Stop guard blocks once in a generated app and never elsewhere", () => {
  // Both trees hold the uncommitted leakFeature.tsx from the previous test.
  const blocked = fire("Stop", appDir, {});
  expect(blocked.status).toBe(2);
  expect(blocked.stderr).toContain("features/crm/leakFeature.tsx");
  expect(fire("Stop", appDir, { stop_hook_active: true }).status).toBe(0);

  const elsewhere = fire("Stop", otherDir, {});
  expect(elsewhere.status).toBe(0);
  expect(elsewhere.stderr).toBe("");
});

test("findings group by CC id from the message, other rules by their id", () => {
  const groups = groupFindings(
    [
      {
        filePath: "/app/lib/a.ts",
        messages: [
          {
            ruleId: "codependent/layer-boundaries",
            message: "[CC-SRV-001] x",
            line: 3,
          },
          {
            ruleId: "codependent/layer-boundaries",
            message: "[CC-SRV-001] y",
            line: 9,
          },
          { ruleId: "no-unused-vars", message: "'a' is unused", line: 1 },
        ],
      },
      {
        filePath: "/app/b.ts",
        messages: [{ ruleId: null, message: "Parsing error" }],
      },
    ],
    "/app",
  );
  expect(groups).toEqual([
    {
      id: "CC-SRV-001",
      findings: [
        { file: "lib/a.ts", line: 3, message: "[CC-SRV-001] x" },
        { file: "lib/a.ts", line: 9, message: "[CC-SRV-001] y" },
      ],
    },
    {
      id: "no-unused-vars",
      findings: [{ file: "lib/a.ts", line: 1, message: "'a' is unused" }],
    },
    {
      id: "parse",
      findings: [{ file: "b.ts", line: 0, message: "Parsing error" }],
    },
  ]);
});
