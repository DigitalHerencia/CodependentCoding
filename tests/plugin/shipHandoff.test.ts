import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";

import { afterAll, beforeAll, expect, test } from "vitest";

import { composeApp } from "@/packages/cli/src/compose/composeApp";
import { checkExecution } from "@/plugin/loaded-vibes/scripts/execution-check.mjs";
import { planEnv } from "@/plugin/loaded-vibes/scripts/ship-env.mjs";
import { smoke } from "@/plugin/loaded-vibes/scripts/smoke.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const scripts = path.join(repo, "plugin/loaded-vibes/scripts");
const templateDir = path.join(repo, "template");
mkdirSync(path.join(templateDir, ".sandbox"), { recursive: true });
const sandbox = mkdtempSync(path.join(templateDir, ".sandbox", "ship-"));
const appDir = path.join(sandbox, "app");
const execution = (name: string) =>
  path.join(appDir, ".claude/execution", `${name}.json`);
const readJson = (name: string) =>
  JSON.parse(readFileSync(execution(name), "utf8")) as Record<string, unknown>;
const writeJson = (name: string, data: unknown) =>
  writeFileSync(execution(name), JSON.stringify(data, null, 2));

beforeAll(async () => {
  await composeApp({
    templateDir,
    outDir: appDir,
    modules: ["crm"],
    name: "ship",
    color: null,
    cliVersion: "0.0.0-test",
    now: new Date("2026-10-24T00:00:00Z"),
  });
});
afterAll(() => rmSync(sandbox, { recursive: true, force: true }));

test("ship-env pushes set names, keeps test-only ones local and never prints values", () => {
  const secret = "postgres://owner:s3cret@example.invalid/db";
  writeFileSync(
    path.join(appDir, ".env.local"),
    [
      `DATABASE_URL="${secret}"`,
      "CLERK_SECRET_KEY=sk_test_abc",
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""',
      "DATABASE_URL_TEST=postgres://test",
      "",
    ].join("\n"),
  );
  const { plan } = planEnv(appDir);
  expect(plan.push).toEqual(["DATABASE_URL", "CLERK_SECRET_KEY"]);
  expect(plan.localOnly).toContain("DATABASE_URL_TEST");
  expect(plan.unset).toContain("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  expect(plan.missingRequired).toEqual([]);

  // A stand-in vercel CLI records its argv and stdin.
  const bin = path.join(sandbox, "bin");
  const log = path.join(sandbox, "vercel.log");
  mkdirSync(bin);
  writeFileSync(
    path.join(bin, "vercel"),
    `#!/bin/sh\necho "argv: $*" >> "${log}"\necho "stdin: $(cat)" >> "${log}"\n`,
  );
  chmodSync(path.join(bin, "vercel"), 0o755);
  const run = (...args: string[]) =>
    spawnSync(
      process.execPath,
      [path.join(scripts, "ship-env.mjs"), appDir, ...args],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}${path.delimiter}${process.env.PATH}`,
        },
      },
    );

  const dry = run();
  expect(dry.status).toBe(0);
  expect(dry.stdout).toContain(
    "push to Vercel production (2): DATABASE_URL, CLERK_SECRET_KEY",
  );
  expect(dry.stdout).toContain("DRY RUN");

  const applied = run("--apply");
  expect(applied.status).toBe(0);
  expect(`${applied.stdout}${applied.stderr}`).not.toContain("s3cret");
  const calls = readFileSync(log, "utf8");
  expect(calls).toContain(
    "argv: env add DATABASE_URL --environment production --sensitive --force --yes",
  );
  expect(calls).toContain(`stdin: ${secret}`);
  expect(
    calls
      .split("\n")
      .filter((line) => line.startsWith("argv:"))
      .join("\n"),
  ).not.toContain("s3cret");
  expect(calls).not.toContain("DATABASE_URL_TEST");

  rmSync(path.join(appDir, ".env.local"));
  const missing = run("--apply");
  expect(missing.status).toBe(1);
  expect(missing.stderr).toContain(
    "required but unset in .env.local: DATABASE_URL",
  );
});

test("smoke passes a healthy app and fails one without the sign-in redirect", async () => {
  const serve = (handler: Parameters<typeof createServer>[1]) =>
    new Promise<Server>((resolve) => {
      const server = createServer(handler);
      server.listen(0, "127.0.0.1", () => resolve(server));
    });
  const url = (server: Server) =>
    `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  const healthy = await serve((request, response) => {
    if (request.url === "/dashboard") {
      response
        .writeHead(307, { location: "/sign-in?redirect_url=%2Fdashboard" })
        .end();
    } else
      response
        .writeHead(200, { "content-type": "text/html" })
        .end("<h1>Hi</h1>");
  });
  const broken = await serve((_request, response) => {
    response
      .writeHead(200, { "content-type": "text/html" })
      .end("<h1>Open</h1>");
  });
  try {
    expect((await smoke(url(healthy))).map(({ ok }) => ok)).toEqual([
      true,
      true,
    ]);
    const failed = await smoke(url(broken));
    expect(failed.map(({ ok }) => ok)).toEqual([true, false]);
    expect(failed[1]?.detail).toBe("200");
  } finally {
    healthy.close();
    broken.close();
  }
});

test("a fresh app's execution state is consistent and broken state is named", () => {
  expect(checkExecution(appDir)).toEqual([]);

  const issues = path.join(appDir, "context/specs/issues");
  writeFileSync(
    path.join(issues, "SH-001-orders-slice.md"),
    "---\nid: SH-001\n---\n",
  );
  const decisions = readJson("decisions") as {
    decisions: Record<string, unknown>[];
  };
  decisions.decisions.push(
    {
      id: "DEC-001",
      date: "2026-10-24",
      status: "accepted",
      title: "dup",
      decision: "x",
    },
    { id: "D-3", title: "bad" },
  );
  writeJson("decisions", decisions);
  writeJson("handoff", {
    ...readJson("handoff"),
    next_issue: "SH-009",
    queue: ["SH-001"],
  });
  writeJson("progress", {
    ...readJson("progress"),
    issues: {
      "SH-001": {
        status: "done",
        acceptance: { "Orders list renders": "passed" },
      },
      "SH-002": { status: "shipped" },
    },
    evidence: [{ command: "pnpm test" }],
    checks: [{ command: "pnpm lint", result: "exit 0" }],
  });

  expect(checkExecution(appDir)).toEqual([
    "decisions.json: decisions[1]: DEC-001 is not after DEC-001 (append only)",
    "decisions.json: decisions[2]: id must be DEC-NNN",
    "handoff.json: next_issue: SH-009 has no file in context/specs/issues",
    "progress.json: checks is not part of the record format (use evidence)",
    'progress.json: issues.SH-001: acceptance "passed" must start with EXECUTED, INSPECTED, NOT_RUN or BLOCKED',
    "progress.json: issues.SH-001: done needs at least one EXECUTED acceptance line",
    "progress.json: issues: SH-002 has no file in context/specs/issues",
    'progress.json: issues.SH-002: status "shipped" is not one of todo, in-progress, in-review, done, blocked',
    "progress.json: evidence[0] needs command, result and state (EXECUTED, INSPECTED, NOT_RUN or BLOCKED)",
  ]);

  const cli = spawnSync(
    process.execPath,
    [path.join(scripts, "execution-check.mjs"), appDir],
    {
      encoding: "utf8",
    },
  );
  expect(cli.status).toBe(1);
  expect(cli.stderr).toContain("9 problem(s) in .claude/execution.");
  expect(checkExecution(sandbox)).toEqual([
    `${sandbox}: not a generated app (no hipster.json)`,
  ]);
});
