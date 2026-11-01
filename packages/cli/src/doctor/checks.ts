import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import type { QuerySql } from "#cli/setup/database";
import { parseEnv } from "#cli/setup/envFile";
import type { Exec } from "#cli/setup/exec";
import { readSchema } from "#cli/slice/prismaSchema";

export type CheckStatus = "pass" | "warn" | "fail" | "skip";

export interface CheckResult {
  check: string;
  status: CheckStatus;
  detail: string;
  /** What to run or change; set unless the check passed. */
  hint?: string;
}

export interface DoctorOptions {
  appDir: string;
  exec: Exec;
  query: QuerySql;
  /** The shell environment; it wins over .env files, as in Next.js. */
  processEnv: Readonly<Record<string, string | undefined>>;
  /** false skips lint and ownership (the slow checks). */
  tools: boolean;
}

interface EnvEntry {
  name: string;
  required?: boolean;
}

interface Manifest {
  base: { env?: EnvEntry[] };
  modules: { id: string; env?: EnvEntry[] }[];
}

/** Next.js precedence: shell, then .env.local, then .env. */
function loadEnv(
  appDir: string,
  processEnv: DoctorOptions["processEnv"],
): Map<string, string> {
  const values = new Map<string, string>();
  for (const file of [".env", ".env.local"]) {
    const full = path.join(appDir, file);
    if (!existsSync(full)) continue;
    parseEnv(readFileSync(full, "utf8")).forEach((value, key) =>
      values.set(key, value),
    );
  }
  for (const [key, value] of Object.entries(processEnv)) {
    if (value) values.set(key, value);
  }
  return values;
}

function envCheck(manifest: Manifest, env: Map<string, string>): CheckResult {
  const required = [
    ...(manifest.base.env ?? []),
    ...manifest.modules.flatMap((entry) => entry.env ?? []),
  ]
    .filter((entry) => entry.required)
    .map(({ name }) => name);
  const missing = required.filter((name) => !env.has(name));
  if (missing.length === 0) {
    return {
      check: "env",
      status: "pass",
      detail: `${required.length} required variables set`,
    };
  }
  return {
    check: "env",
    status: "warn",
    detail: `missing ${missing.join(", ")}`,
    hint: "Add them to .env.local (descriptions in .env.example).",
  };
}

/** Models that need RLS: required organizationId, plus User and Organization (tests/rlsFiles.test.ts). */
export function tenantTables(appDir: string): string[] {
  const tables: string[] = [];
  for (const { text } of readSchema(appDir)) {
    for (const [, name, body] of text.matchAll(
      /^model (\w+) \{\n([\s\S]*?)^\}/gm,
    )) {
      const tenant = /^\s+organizationId\s+String\s/m.test(body ?? "");
      if (tenant || name === "User" || name === "Organization") {
        tables.push(name as string);
      }
    }
  }
  return tables.sort();
}

function localMigrations(appDir: string): string[] {
  const dir = path.join(appDir, "prisma", "migrations");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

const DB_HINT = "pnpm db:init";

/** The role the policies are written for (template prisma/rls/identity.sql). */
export const RUNTIME_ROLE = "app_runtime";
const ROLE_NAME = /^[A-Za-z_][A-Za-z0-9_$]*$/;

function urlUser(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return decodeURIComponent(new URL(url).username) || null;
  } catch {
    return null;
  }
}

/**
 * CC-DB-004 / ledger D-1: the app's DATABASE_URL logs in as app_runtime (or a
 * member of it) that is not the owner, not SUPERUSER or BYPASSRLS, not in
 * neon_superuser (whose members can SET ROLE into BYPASSRLS), and owns no table.
 */
async function runtimeRoleCheck(
  env: Map<string, string>,
  ownerUrl: string,
  query: QuerySql,
): Promise<CheckResult> {
  const check = "runtime role";
  const hint = `Point DATABASE_URL at ${RUNTIME_ROLE} (created by the rls migration; set its password with ALTER ROLE ${RUNTIME_ROLE} PASSWORD ...).`;
  const role = urlUser(env.get("DATABASE_URL"));
  if (!role) {
    return {
      check,
      status: "fail",
      detail: "DATABASE_URL names no role",
      hint,
    };
  }
  if (role === urlUser(ownerUrl) && env.get("DATABASE_URL") !== ownerUrl) {
    return { check, status: "fail", detail: `${role} is the owner`, hint };
  }
  if (!ROLE_NAME.test(role)) {
    return { check, status: "fail", detail: "unexpected role name", hint };
  }
  const [row] = await query(
    ownerUrl,
    `select r.rolsuper, r.rolbypassrls,
       exists (select from pg_roles s where s.rolname = 'neon_superuser'
               and pg_has_role(r.oid, s.oid, 'MEMBER')) as neon_superuser,
       exists (select from pg_roles s where s.rolname = '${RUNTIME_ROLE}'
               and pg_has_role(r.oid, s.oid, 'MEMBER')) as runtime,
       (select count(*)::int from pg_class c
        where c.relnamespace = 'public'::regnamespace and c.relowner = r.oid) as owned
     from pg_roles r where r.rolname = '${role}'`,
  );
  if (!row) {
    return { check, status: "fail", detail: `role ${role} not found`, hint };
  }
  const problems = [
    row.rolsuper ? "SUPERUSER" : "",
    row.rolbypassrls ? "BYPASSRLS" : "",
    row.neon_superuser ? "member of neon_superuser" : "",
    Number(row.owned) > 0 ? `owns ${String(row.owned)} tables` : "",
    row.runtime ? "" : `not ${RUNTIME_ROLE}`,
  ].filter(Boolean);
  return problems.length === 0
    ? {
        check,
        status: "pass",
        detail: `${role}: not owner, not BYPASSRLS, not in neon_superuser`,
      }
    : {
        check,
        status: "fail",
        detail: `${role}: ${problems.join(", ")}`,
        hint: `Use ${RUNTIME_ROLE}, created in SQL by the rls migration, never in the Neon Console.`,
      };
}

async function databaseChecks(
  appDir: string,
  env: Map<string, string>,
  query: QuerySql,
): Promise<CheckResult[]> {
  // The owner's direct URL sees every table; the runtime URL is the fallback.
  const url = env.get("DIRECT_DATABASE_URL") ?? env.get("DATABASE_URL");
  if (!url) {
    const skip = (check: string): CheckResult => ({
      check,
      status: "skip",
      detail: "no database URL",
      hint: "Set DATABASE_URL (and DIRECT_DATABASE_URL) in .env.local.",
    });
    return [
      skip("database"),
      skip("migrations"),
      skip("rls"),
      skip("runtime role"),
    ];
  }
  try {
    await query(url, "select 1");
  } catch (error) {
    return [
      {
        check: "database",
        status: "fail",
        // pg messages name the host or role, never the password.
        detail: (error as Error).message.split("\n")[0] ?? "unreachable",
        hint: "Check DIRECT_DATABASE_URL / DATABASE_URL and that the database is running.",
      },
      { check: "migrations", status: "skip", detail: "database unreachable" },
      { check: "rls", status: "skip", detail: "database unreachable" },
      {
        check: "runtime role",
        status: "skip",
        detail: "database unreachable",
      },
    ];
  }
  const results: CheckResult[] = [
    { check: "database", status: "pass", detail: "reachable" },
  ];

  const local = localMigrations(appDir);
  let applied: string[] | null = null;
  try {
    applied = (
      await query(
        url,
        "select migration_name from _prisma_migrations where finished_at is not null and rolled_back_at is null order by migration_name",
      )
    ).map((row) => String(row.migration_name));
  } catch {
    applied = null;
  }
  if (applied === null || (local.length === 0 && applied.length === 0)) {
    results.push({
      check: "migrations",
      status: "fail",
      detail: "no migrations applied",
      hint: DB_HINT,
    });
  } else {
    const pending = local.filter((name) => !applied.includes(name));
    const unknown = applied.filter((name) => !local.includes(name));
    results.push(
      pending.length > 0
        ? {
            check: "migrations",
            status: "fail",
            detail: `pending ${pending.join(", ")}`,
            hint: DB_HINT,
          }
        : unknown.length > 0
          ? {
              check: "migrations",
              status: "warn",
              detail: `applied but not in prisma/migrations: ${unknown.join(", ")}`,
              hint: "Pull the migrations this database was built from.",
            }
          : {
              check: "migrations",
              status: "pass",
              detail: `${applied.length} applied`,
            },
    );
  }

  const rows = await query(
    url,
    "select c.relname, c.relrowsecurity, c.relforcerowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r'",
  );
  const byName = new Map(rows.map((row) => [String(row.relname), row]));
  const tables = tenantTables(appDir);
  const missing = tables.filter((table) => !byName.has(table));
  const open = tables.filter((table) => {
    const row = byName.get(table);
    return row && !(row.relrowsecurity && row.relforcerowsecurity);
  });
  results.push(
    missing.length + open.length === 0
      ? {
          check: "rls",
          status: "pass",
          detail: `forced on ${tables.length} tenant tables`,
        }
      : {
          check: "rls",
          status: "fail",
          detail: [
            open.length > 0 ? `not forced on ${open.join(", ")}` : "",
            missing.length > 0 ? `missing tables ${missing.join(", ")}` : "",
          ]
            .filter(Boolean)
            .join("; "),
          hint: `${DB_HINT} (applies prisma/rls/*.sql)`,
        },
  );
  results.push(await runtimeRoleCheck(env, url, query));
  return results;
}

function toolCheck(
  check: string,
  script: string,
  appDir: string,
  exec: Exec,
): CheckResult {
  const result = exec("pnpm", ["run", "--silent", script], {
    cwd: appDir,
    capture: "all",
  });
  if (result.missing) {
    return {
      check,
      status: "fail",
      detail: "pnpm not found",
      hint: "Install pnpm (corepack enable).",
    };
  }
  if (result.status === 0) return { check, status: "pass", detail: "clean" };
  const output = `${result.stdout}\n${result.stderr}`.trim().split("\n");
  return {
    check,
    status: "fail",
    detail: output.at(-1)?.trim() || `exit ${result.status}`,
    hint: `pnpm ${script}`,
  };
}

/**
 * Read-only readiness checks for a generated app (CC-034): env, database,
 * migrations, RLS, lint and ownership. Nothing is written; values from .env
 * files are only tested for presence and never printed.
 */
export async function runDoctor(
  options: DoctorOptions,
): Promise<CheckResult[]> {
  const { appDir } = options;
  if (!existsSync(path.join(appDir, "hipster.json"))) {
    throw new Error(
      `${appDir} is not a generated app (no hipster.json). Run doctor inside an app made by \`hipster-stack new\`.`,
    );
  }
  const manifest = JSON.parse(
    readFileSync(path.join(appDir, "hipster.modules.json"), "utf8"),
  ) as Manifest;
  const env = loadEnv(appDir, options.processEnv);
  const results = [
    envCheck(manifest, env),
    ...(await databaseChecks(appDir, env, options.query)),
  ];

  if (!options.tools) {
    results.push(
      { check: "lint", status: "skip", detail: "--no-tools" },
      { check: "ownership", status: "skip", detail: "--no-tools" },
    );
  } else if (!existsSync(path.join(appDir, "node_modules"))) {
    const install: CheckResult = {
      check: "lint",
      status: "warn",
      detail: "not installed",
      hint: "pnpm install",
    };
    results.push(install, { ...install, check: "ownership" });
  } else {
    results.push(
      toolCheck("lint", "lint", appDir, options.exec),
      toolCheck("ownership", "check:ownership", appDir, options.exec),
    );
  }
  return results;
}

const MARK: Record<CheckStatus, string> = {
  pass: "pass",
  warn: "warn",
  fail: "FAIL",
  skip: "skip",
};

/** A plain-text table: check, status, detail, then the fix on its own line. */
export function formatResults(results: readonly CheckResult[]): string {
  const width = Math.max(...results.map(({ check }) => check.length));
  return results
    .flatMap(({ check, status, detail, hint }) => [
      `${MARK[status]}  ${check.padEnd(width)}  ${detail}`,
      ...(hint && status !== "pass"
        ? [`      ${" ".repeat(width)}  → ${hint}`]
        : []),
    ])
    .join("\n");
}
