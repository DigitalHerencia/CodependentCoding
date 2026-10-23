import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "vitest";

import { appRoleSql, withCredentials } from "@/packages/cli/src/setup/database";
import { parseEnv, upsertEnv } from "@/packages/cli/src/setup/envFile";
import type { Exec, ExecResult } from "@/packages/cli/src/setup/exec";
import { INITIAL_COMMIT, setupApp } from "@/packages/cli/src/setup/postCompose";
import {
  provision,
  type ProvisionContext,
  type StepId,
} from "@/packages/cli/src/setup/provision";

const NETWORK_CLIS = ["gh", "neonctl", "vercel"];
const OWNER_DIRECT =
  "postgresql://owner:ownerpw@ep-x.neon.tech/neondb?sslmode=require";
const OWNER_POOLED =
  "postgresql://owner:ownerpw@ep-x-pooler.neon.tech/neondb?sslmode=require";

interface Call {
  command: string;
  args: string[];
  input: string | undefined;
}

type Handler = (args: string[]) => Partial<ExecResult> | undefined;

/** A fake PATH: commands not in `handlers` are "not installed". */
function fakeExec(handlers: Record<string, Handler>) {
  const calls: Call[] = [];
  const exec: Exec = (command, args, { input }) => {
    calls.push({ command, args: [...args], input });
    const handler = handlers[command];
    if (!handler)
      return { status: null, stdout: "", stderr: "", missing: true };
    return {
      status: 0,
      stdout: "",
      stderr: "",
      missing: false,
      ...handler([...args]),
    };
  };
  return { exec, calls };
}

function appDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "hipster-prov-"));
  writeFileSync(
    path.join(dir, ".env.example"),
    '# header\nDATABASE_URL=""\nDIRECT_DATABASE_URL=""\nCLERK_SECRET_KEY=""\n',
  );
  return dir;
}

const fail = { status: 1 };

/** A fresh account: nothing exists yet. */
function freshWorld() {
  let origin = false;
  const neonProjects: { id: string; name: string }[] = [];
  return fakeExec({
    git: (args) => {
      if (args[0] === "remote" && args[1] === "get-url")
        return origin ? {} : fail;
      if (args[0] === "remote" && args[1] === "add") origin = true;
      return {};
    },
    gh: (args) => {
      if (args[0] === "repo" && args[1] === "view") return fail;
      if (args[0] === "repo" && args[1] === "create") origin = true;
      return {};
    },
    neonctl: (args) => {
      if (args[0] === "projects" && args[1] === "list") {
        return { stdout: JSON.stringify(neonProjects) };
      }
      if (args[0] === "projects" && args[1] === "create") {
        neonProjects.push({ id: "proj-1", name: "demo" });
        return {
          stdout: JSON.stringify({ project: { id: "proj-1", name: "demo" } }),
        };
      }
      if (args[0] === "connection-string") {
        return {
          stdout: `${args.includes("--pooled") ? OWNER_POOLED : OWNER_DIRECT}\n`,
        };
      }
      return {};
    },
    vercel: (args) => {
      if (args[0] === "project" && args[1] === "inspect") return fail;
      return {};
    },
  });
}

function context(
  dir: string,
  exec: Exec,
  overrides: Partial<ProvisionContext> = {},
) {
  const sql: { url: string; sql: string }[] = [];
  const warnings: string[] = [];
  const ctx: ProvisionContext = {
    appDir: dir,
    name: "demo",
    git: true,
    exec,
    runSql: async (url, text) => {
      sql.push({ url, sql: text });
    },
    log: { info: () => {}, warn: (message) => warnings.push(message) },
    enabled: { github: true, neon: true, vercel: true },
    password: () => "apppw123",
    ...overrides,
  };
  return { ctx, sql, warnings };
}

const statuses = (outcomes: { step: StepId; status: string }[]) =>
  Object.fromEntries(outcomes.map(({ step, status }) => [step, status]));

describe("env file", () => {
  test("upsert replaces keys in place, keeps other lines, appends the rest", () => {
    const next = upsertEnv('# c\nA=""\nB="keep"\n', { A: "1", C: "3" });
    expect(next).toBe('# c\nA="1"\nB="keep"\nC="3"\n');
    expect(parseEnv(next)).toEqual(
      new Map([
        ["A", "1"],
        ["B", "keep"],
        ["C", "3"],
      ]),
    );
  });

  test("blank values count as unset", () => {
    expect(parseEnv('A=""\nB=\nC=x # note\n')).toEqual(new Map([["C", "x"]]));
  });
});

describe("app role SQL", () => {
  test("creates or resets a login role without BYPASSRLS, with table rights", () => {
    const sql = appRoleSql("abc123");
    expect(sql).toContain(
      `CREATE ROLE "app_user" LOGIN NOBYPASSRLS PASSWORD 'abc123'`,
    );
    expect(sql).toContain(`ALTER ROLE "app_user" LOGIN PASSWORD 'abc123'`);
    expect(sql).toContain(
      `ALTER DEFAULT PRIVILEGES FOR ROLE "owner" IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "app_user"`,
    );
    expect(() => appRoleSql("x'; DROP")).toThrow();
  });

  test("app URL keeps host, database and options of the owner URL", () => {
    expect(withCredentials(OWNER_POOLED, "app_user", "pw")).toBe(
      "postgresql://app_user:pw@ep-x-pooler.neon.tech/neondb?sslmode=require",
    );
  });
});

describe("setupApp", () => {
  test("validates, installs, inits and commits; no provisioning CLI runs", () => {
    const { exec, calls } = fakeExec({
      [process.execPath]: () => ({}),
      pnpm: () => ({}),
      git: () => ({}),
    });
    const result = setupApp({
      appDir: "/app",
      templateDir: "/template",
      install: true,
      git: true,
      exec,
      warn: () => {},
    });
    expect(result.committed).toBe(true);
    expect(
      calls.map(({ command, args }) => [command, ...args.slice(0, 2)]),
    ).toEqual([
      [
        process.execPath,
        path.join("/template", "node_modules", "prisma", "build", "index.js"),
        "validate",
      ],
      ["pnpm", "install", "--no-frozen-lockfile"],
      ["git", "init", "--quiet"],
      ["git", "add", "--all"],
      ["git", "commit", "--quiet"],
    ]);
    expect(calls.at(-1)?.args.at(-1)).toBe(INITIAL_COMMIT);
    expect(calls.some(({ command }) => NETWORK_CLIS.includes(command))).toBe(
      false,
    );
  });

  test("--no-install --no-git only validates", () => {
    const { exec, calls } = fakeExec({ [process.execPath]: () => ({}) });
    setupApp({
      appDir: "/app",
      templateDir: "/t",
      install: false,
      git: false,
      exec,
      warn: () => {},
    });
    expect(calls.map(({ command }) => command)).toEqual([process.execPath]);
  });

  test("a failed commit (no git identity) warns instead of failing", () => {
    const warnings: string[] = [];
    const { exec } = fakeExec({
      [process.execPath]: () => ({}),
      git: (args) => (args[0] === "commit" ? fail : {}),
    });
    const result = setupApp({
      appDir: "/app",
      templateDir: "/t",
      install: false,
      git: true,
      exec,
      warn: (message) => warnings.push(message),
    });
    expect(result.committed).toBe(false);
    expect(warnings[0]).toContain("user.email");
  });
});

describe("provision", () => {
  test("missing CLIs are reported with install guidance and nothing runs", async () => {
    const dir = appDir();
    const { exec, calls } = fakeExec({ git: () => fail });
    const { ctx, sql, warnings } = context(dir, exec);
    const outcomes = await provision(ctx);
    expect(statuses(outcomes)).toEqual({
      github: "unavailable",
      neon: "unavailable",
      vercel: "unavailable",
    });
    expect(warnings.join("\n")).toMatch(
      /cli\.github\.com[\s\S]*npm i -g neonctl[\s\S]*npm i -g vercel/,
    );
    expect(calls.every(({ args }) => args[0] === "--version")).toBe(true);
    expect(sql).toEqual([]);
  });

  test("not signed in points at the login command", async () => {
    const dir = appDir();
    const { exec } = fakeExec({
      gh: (args) => (args[0] === "auth" ? fail : {}),
      neonctl: (args) => (args[0] === "me" ? fail : {}),
      vercel: (args) => (args[0] === "whoami" ? fail : {}),
    });
    const { ctx, warnings } = context(dir, exec);
    await provision(ctx);
    expect(warnings).toEqual([
      expect.stringContaining("gh auth login"),
      expect.stringContaining("neonctl auth"),
      expect.stringContaining("vercel login"),
    ]);
  });

  test("fresh account: creates repo, Neon project + roles, Vercel project + env", async () => {
    const dir = appDir();
    const { exec, calls } = freshWorld();
    const { ctx, sql } = context(dir, exec);
    const outcomes = await provision(ctx);
    expect(statuses(outcomes)).toEqual({
      github: "done",
      neon: "done",
      vercel: "done",
    });

    const ran = (command: string, ...prefix: string[]) =>
      calls.find(
        (call) =>
          call.command === command &&
          prefix.every((arg, i) => call.args[i] === arg),
      );
    expect(ran("gh", "repo", "create")?.args).toEqual([
      "repo",
      "create",
      "demo",
      "--private",
      "--source",
      ".",
      "--remote",
      "origin",
      "--push",
    ]);
    expect(ran("neonctl", "projects", "create")?.args).toEqual([
      "projects",
      "create",
      "--name",
      "demo",
      "--role",
      "owner",
      "--output",
      "json",
    ]);
    expect(sql).toEqual([{ url: OWNER_DIRECT, sql: appRoleSql("apppw123") }]);

    const env = readFileSync(path.join(dir, ".env.local"), "utf8");
    expect(parseEnv(env).get("DATABASE_URL")).toBe(
      "postgresql://app_user:apppw123@ep-x-pooler.neon.tech/neondb?sslmode=require",
    );
    expect(parseEnv(env).get("DIRECT_DATABASE_URL")).toBe(OWNER_DIRECT);
    expect(env).toContain('CLERK_SECRET_KEY=""');

    expect(ran("vercel", "project", "create")?.args).toEqual([
      "project",
      "create",
      "demo",
    ]);
    expect(ran("vercel", "link")?.args).toEqual([
      "link",
      "--yes",
      "--project",
      "demo",
    ]);
    const envAdds = calls.filter(
      (call) => call.command === "vercel" && call.args[0] === "env",
    );
    expect(envAdds.map(({ args, input }) => [args[2], input])).toEqual([
      [
        "DATABASE_URL",
        "postgresql://app_user:apppw123@ep-x-pooler.neon.tech/neondb?sslmode=require",
      ],
      ["DIRECT_DATABASE_URL", OWNER_DIRECT],
    ]);
    // Secrets travel on stdin only.
    for (const call of calls) {
      expect(call.args.join(" ")).not.toMatch(/apppw123|ownerpw/);
    }
  });

  test("re-running in the same app creates nothing", async () => {
    const dir = appDir();
    const world = freshWorld();
    await provision(context(dir, world.exec).ctx);
    mkdirSync(path.join(dir, ".vercel"));
    writeFileSync(path.join(dir, ".vercel", "project.json"), "{}");
    const before = world.calls.length;

    const outcomes = await provision(context(dir, world.exec).ctx);
    expect(statuses(outcomes)).toEqual({
      github: "exists",
      neon: "exists",
      vercel: "exists",
    });
    const creates = world.calls
      .slice(before)
      .filter(({ args }) => args.includes("create") || args[0] === "link");
    expect(creates).toEqual([]);
  });

  test("an existing Neon project with the app's name is reused, not duplicated", async () => {
    const dir = appDir();
    const world = freshWorld();
    await provision(
      context(dir, world.exec, {
        enabled: { github: false, neon: true, vercel: false },
      }).ctx,
    );
    writeFileSync(path.join(dir, ".env.local"), "");
    const before = world.calls.length;
    const outcomes = await provision(
      context(dir, world.exec, {
        enabled: { github: false, neon: true, vercel: false },
      }).ctx,
    );
    expect(statuses(outcomes).neon).toBe("exists");
    expect(
      world.calls.slice(before).some(({ args }) => args[1] === "create"),
    ).toBe(false);
    expect(
      parseEnv(readFileSync(path.join(dir, ".env.local"), "utf8")).has(
        "DATABASE_URL",
      ),
    ).toBe(true);
  });

  test("disabled or declined steps never call their CLI", async () => {
    const dir = appDir();
    const { exec, calls } = freshWorld();
    const { ctx } = context(dir, exec, {
      enabled: { github: false, neon: true, vercel: true },
      confirm: async (step) => step !== "vercel",
    });
    const outcomes = await provision(ctx);
    expect(statuses(outcomes)).toEqual({
      github: "skipped",
      neon: "done",
      vercel: "skipped",
    });
    expect(
      calls.some(({ command }) => command === "gh" || command === "vercel"),
    ).toBe(false);
  });

  test("--no-git skips the repo; a failing step does not stop the others", async () => {
    const dir = appDir();
    const { exec } = fakeExec({
      neonctl: (args) => (args[0] === "projects" ? fail : {}),
      vercel: (args) =>
        args[0] === "project" && args[1] === "inspect" ? fail : {},
    });
    const { ctx } = context(dir, exec, { git: false });
    const outcomes = await provision(ctx);
    expect(statuses(outcomes)).toEqual({
      github: "skipped",
      neon: "failed",
      vercel: "done",
    });
    expect(outcomes[2]?.detail).toContain("No database URLs");
  });
});
