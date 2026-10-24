import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "vitest";

import { composeApp } from "@/packages/cli/src/compose/composeApp";
import {
  type CheckResult,
  formatResults,
  runDoctor,
  tenantTables,
} from "@/packages/cli/src/doctor/checks";
import type { QuerySql } from "@/packages/cli/src/setup/database";
import type { Exec } from "@/packages/cli/src/setup/exec";

const templateDir = path.resolve(import.meta.dirname, "../../template");
const SECRET = "postgresql://owner:s3cret@db.example/app";

async function app(modules: string[]): Promise<string> {
  const outDir = path.join(
    mkdtempSync(path.join(tmpdir(), "hipster-doctor-")),
    "app",
  );
  await composeApp({
    templateDir,
    outDir,
    modules,
    name: "demo",
    color: null,
    cliVersion: "0.0.0-test",
    now: new Date("2026-10-24T00:00:00Z"),
  });
  return outDir;
}

const noExec: Exec = () => {
  throw new Error("no command expected");
};
const noQuery: QuerySql = () => {
  throw new Error("no query expected");
};

const byCheck = (results: CheckResult[]) =>
  Object.fromEntries(results.map((result) => [result.check, result]));

/** A database that answers doctor's three queries. */
function database(
  applied: string[],
  tables: { name: string; forced: boolean }[],
): { query: QuerySql; urls: string[] } {
  const urls: string[] = [];
  const query: QuerySql = async (url, sql) => {
    urls.push(url);
    if (sql === "select 1") return [{ "?column?": 1 }];
    if (sql.includes("_prisma_migrations")) {
      return applied.map((migration_name) => ({ migration_name }));
    }
    return tables.map(({ name, forced }) => ({
      relname: name,
      relrowsecurity: forced,
      relforcerowsecurity: forced,
    }));
  };
  return { query, urls };
}

describe("doctor", () => {
  test("fresh app: names the missing env, skips the database", async () => {
    const dir = await app([]);
    const results = byCheck(
      await runDoctor({
        appDir: dir,
        exec: noExec,
        query: noQuery,
        processEnv: {},
        tools: false,
      }),
    );
    expect(results.env).toMatchObject({
      status: "warn",
      detail: "missing DATABASE_URL",
    });
    expect(results.database?.status).toBe("skip");
    expect(results.rls?.status).toBe("skip");
    expect(results.lint?.status).toBe("skip");
  });

  test("all green, preferring the direct URL; values are never printed", async () => {
    const dir = await app(["crm"]);
    writeFileSync(
      path.join(dir, ".env.local"),
      `DATABASE_URL="postgresql://app_user:x@db.example/app"\nDIRECT_DATABASE_URL="${SECRET}"\n`,
    );
    mkdirSync(path.join(dir, "prisma/migrations/20261024000000_init"), {
      recursive: true,
    });
    const tables = tenantTables(dir);
    expect(tables).toEqual(
      expect.arrayContaining(["CrmDeal", "Membership", "Organization", "User"]),
    );
    const { query, urls } = database(
      ["20261024000000_init"],
      tables.map((name) => ({ name, forced: true })),
    );
    mkdirSync(path.join(dir, "node_modules"));
    const ran: string[] = [];
    const exec: Exec = (command, args) => {
      ran.push([command, ...args].join(" "));
      return { status: 0, stdout: "", stderr: "", missing: false };
    };
    const results = await runDoctor({
      appDir: dir,
      exec,
      query,
      processEnv: {},
      tools: true,
    });
    expect(results.map(({ status }) => status)).toEqual(Array(6).fill("pass"));
    expect(new Set(urls)).toEqual(new Set([SECRET]));
    expect(ran).toEqual([
      "pnpm run --silent lint",
      "pnpm run --silent check:ownership",
    ]);
    expect(formatResults(results)).not.toContain("s3cret");
  });

  test("pending migrations, unforced RLS and lint findings fail with hints", async () => {
    const dir = await app(["crm"]);
    mkdirSync(path.join(dir, "prisma/migrations/20261024000000_init"), {
      recursive: true,
    });
    mkdirSync(path.join(dir, "node_modules"));
    const { query } = database(
      [],
      tenantTables(dir)
        .filter((name) => name !== "CrmContact")
        .map((name) => ({ name, forced: name !== "CrmDeal" })),
    );
    const exec: Exec = (_command, args) => ({
      status: args.includes("lint") ? 1 : 0,
      stdout: "✖ 2 problems (2 errors, 0 warnings)\n",
      stderr: "",
      missing: false,
    });
    const results = await runDoctor({
      appDir: dir,
      exec,
      query,
      processEnv: { DATABASE_URL: SECRET },
      tools: true,
    });
    const checks = byCheck(results);
    expect(checks.migrations).toMatchObject({
      status: "fail",
      detail: "pending 20261024000000_init",
      hint: "pnpm db:init",
    });
    expect(checks.rls).toMatchObject({
      status: "fail",
      detail: "not forced on CrmDeal; missing tables CrmContact",
    });
    expect(checks.lint).toMatchObject({
      status: "fail",
      detail: "✖ 2 problems (2 errors, 0 warnings)",
      hint: "pnpm lint",
    });
    expect(checks.ownership?.status).toBe("pass");
    expect(formatResults(results)).toContain("→ pnpm db:init");
  });

  test("an unreachable database fails once and skips what depends on it", async () => {
    const dir = await app([]);
    const results = byCheck(
      await runDoctor({
        appDir: dir,
        exec: noExec,
        query: async () => {
          throw new Error("connect ECONNREFUSED 127.0.0.1:5432");
        },
        processEnv: { DATABASE_URL: SECRET },
        tools: false,
      }),
    );
    expect(results.database).toMatchObject({
      status: "fail",
      detail: "connect ECONNREFUSED 127.0.0.1:5432",
    });
    expect(results.migrations?.status).toBe("skip");
    expect(results.rls?.status).toBe("skip");
  });

  test("not installed: lint and ownership warn instead of running", async () => {
    const dir = await app([]);
    const results = byCheck(
      await runDoctor({
        appDir: dir,
        exec: noExec,
        query: noQuery,
        processEnv: {},
        tools: true,
      }),
    );
    expect(results.lint).toMatchObject({
      status: "warn",
      hint: "pnpm install",
    });
    expect(results.ownership?.status).toBe("warn");
  });

  test("refuses a directory that is not a generated app", async () => {
    await expect(
      runDoctor({
        appDir: tmpdir(),
        exec: noExec,
        query: noQuery,
        processEnv: {},
        tools: false,
      }),
    ).rejects.toThrow(/not a generated app/);
  });
});
