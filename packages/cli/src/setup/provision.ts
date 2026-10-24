import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";

import {
  APP_ROLE,
  appRoleSql,
  OWNER_ROLE,
  type RunSql,
  withCredentials,
} from "#cli/setup/database";
import { readEnvLocal, writeEnvLocal } from "#cli/setup/envFile";
import type { Exec } from "#cli/setup/exec";

export type StepId = "github" | "neon" | "vercel";

export const STEPS: readonly StepId[] = ["github", "neon", "vercel"];

/** done: created now · exists: already set up, left as is · skipped: by choice
 * · unavailable: a CLI or login is missing · failed: a command errored. */
export type StepStatus =
  "done" | "exists" | "skipped" | "unavailable" | "failed";

export interface StepOutcome {
  step: StepId;
  status: StepStatus;
  detail: string;
}

export interface ProvisionLog {
  info(message: string): void;
  warn(message: string): void;
}

export interface ProvisionContext {
  appDir: string;
  name: string;
  /** false when `new` ran with --no-git; the repo step needs a commit. */
  git: boolean;
  exec: Exec;
  runSql: RunSql;
  log: ProvisionLog;
  /** Steps the user turned off (--no-github etc.) are never asked about. */
  enabled: Readonly<Record<StepId, boolean>>;
  /** Asked before each enabled step in interactive runs; absent = yes. */
  confirm?: ((step: StepId) => Promise<boolean>) | undefined;
  password?: () => string;
}

/** Runtime (app role, pooled) and migration (owner, direct) connections. */
export const DATABASE_KEYS = ["DATABASE_URL", "DIRECT_DATABASE_URL"] as const;

const GUIDANCE: Record<StepId, { install: string; login: string }> = {
  github: {
    install:
      "Install the GitHub CLI: https://cli.github.com (winget install GitHub.cli)",
    login:
      "Sign in with `gh auth login`, then run `hipster-stack new <dir> --provision` again.",
  },
  neon: {
    install: "Install the Neon CLI: `npm i -g neonctl`",
    login:
      "Sign in with `neonctl auth`, then run `hipster-stack new <dir> --provision` again.",
  },
  vercel: {
    install: "Install the Vercel CLI: `npm i -g vercel`",
    login:
      "Sign in with `vercel login`, then run `hipster-stack new <dir> --provision` again.",
  },
};

const COMMAND: Record<StepId, string> = {
  github: "gh",
  neon: "neonctl",
  vercel: "vercel",
};

class StepError extends Error {}

function check(
  ctx: ProvisionContext,
  step: StepId,
  args: readonly string[],
): StepOutcome | null {
  const command = COMMAND[step];
  const version = ctx.exec(command, ["--version"], {
    cwd: ctx.appDir,
    capture: "all",
  });
  if (version.missing || version.status !== 0) {
    return { step, status: "unavailable", detail: GUIDANCE[step].install };
  }
  const login = ctx.exec(command, args, { cwd: ctx.appDir, capture: "all" });
  if (login.status !== 0) {
    return { step, status: "unavailable", detail: GUIDANCE[step].login };
  }
  return null;
}

/** Runs a command whose stdout is needed; failures name the command only. */
function output(
  ctx: ProvisionContext,
  command: string,
  args: readonly string[],
): string {
  const result = ctx.exec(command, args, {
    cwd: ctx.appDir,
    capture: "stdout",
  });
  if (result.status !== 0) {
    throw new StepError(`\`${command} ${args.slice(0, 2).join(" ")}\` failed.`);
  }
  return result.stdout;
}

function run(
  ctx: ProvisionContext,
  command: string,
  args: readonly string[],
  input?: string,
): void {
  const result = ctx.exec(command, args, { cwd: ctx.appDir, input });
  if (result.status !== 0) {
    throw new StepError(`\`${command} ${args.slice(0, 2).join(" ")}\` failed.`);
  }
}

function probe(
  ctx: ProvisionContext,
  command: string,
  args: readonly string[],
) {
  return ctx.exec(command, args, { cwd: ctx.appDir, capture: "all" });
}

function github(ctx: ProvisionContext): StepOutcome {
  if (!ctx.git) {
    return {
      step: "github",
      status: "skipped",
      detail: "Needs git; `new` ran with --no-git.",
    };
  }
  const blocked = check(ctx, "github", ["auth", "status"]);
  if (blocked) return blocked;
  if (probe(ctx, "git", ["remote", "get-url", "origin"]).status === 0) {
    return {
      step: "github",
      status: "exists",
      detail: "origin remote already set.",
    };
  }
  const existing = probe(ctx, "gh", [
    "repo",
    "view",
    ctx.name,
    "--json",
    "url",
    "-q",
    ".url",
  ]);
  if (existing.status === 0 && existing.stdout.trim()) {
    const url = existing.stdout.trim();
    run(ctx, "git", ["remote", "add", "origin", `${url}.git`]);
    return {
      step: "github",
      status: "exists",
      detail: `${url} already exists; added it as origin without pushing.`,
    };
  }
  run(ctx, "gh", [
    "repo",
    "create",
    ctx.name,
    "--private",
    "--source",
    ".",
    "--remote",
    "origin",
    "--push",
  ]);
  return {
    step: "github",
    status: "done",
    detail: `Private repo ${ctx.name} created and pushed.`,
  };
}

interface NeonProject {
  id: string;
  name: string;
}

function parseJson(text: string, what: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new StepError(`Could not read ${what} from neonctl.`);
  }
}

function neonProjects(ctx: ProvisionContext): NeonProject[] {
  const parsed = parseJson(
    output(ctx, "neonctl", ["projects", "list", "--output", "json"]),
    "the project list",
  ) as NeonProject[] | { projects?: NeonProject[] };
  return Array.isArray(parsed) ? parsed : (parsed.projects ?? []);
}

function connectionString(
  ctx: ProvisionContext,
  projectId: string,
  pooled: boolean,
): string {
  const args = [
    "connection-string",
    "--project-id",
    projectId,
    "--role-name",
    OWNER_ROLE,
  ];
  const text = output(ctx, "neonctl", pooled ? [...args, "--pooled"] : args);
  const url = /postgres(?:ql)?:\/\/\S+/.exec(text)?.[0];
  if (!url) throw new StepError("neonctl returned no connection string.");
  return url;
}

async function neon(ctx: ProvisionContext): Promise<StepOutcome> {
  const blocked = check(ctx, "neon", ["me", "--output", "json"]);
  if (blocked) return blocked;
  const env = readEnvLocal(ctx.appDir);
  if (DATABASE_KEYS.every((key) => env.has(key))) {
    return {
      step: "neon",
      status: "exists",
      detail: ".env.local already has database URLs.",
    };
  }

  let project = neonProjects(ctx).find(({ name }) => name === ctx.name);
  const created = !project;
  if (!project) {
    const parsed = parseJson(
      output(ctx, "neonctl", [
        "projects",
        "create",
        "--name",
        ctx.name,
        "--role",
        OWNER_ROLE,
        "--output",
        "json",
      ]),
      "the new project",
    ) as { project?: NeonProject } & Partial<NeonProject>;
    const id = parsed.project?.id ?? parsed.id;
    if (!id) throw new StepError("neonctl did not return the new project id.");
    project = { id, name: ctx.name };
  }

  const ownerDirect = connectionString(ctx, project.id, false);
  const ownerPooled = connectionString(ctx, project.id, true);
  const password = (ctx.password ?? (() => randomBytes(24).toString("hex")))();
  await ctx.runSql(ownerDirect, appRoleSql(password));
  writeEnvLocal(ctx.appDir, {
    DATABASE_URL: withCredentials(ownerPooled, APP_ROLE, password),
    DIRECT_DATABASE_URL: ownerDirect,
  });
  return {
    step: "neon",
    status: created ? "done" : "exists",
    detail: `${created ? "Created" : "Reused"} Neon project ${project.id} (roles ${OWNER_ROLE}, ${APP_ROLE}); URLs written to .env.local.`,
  };
}

function vercel(ctx: ProvisionContext): StepOutcome {
  const blocked = check(ctx, "vercel", ["whoami"]);
  if (blocked) return blocked;
  const notes: string[] = [];
  const linked = existsSync(path.join(ctx.appDir, ".vercel", "project.json"));
  if (linked) {
    notes.push("Already linked.");
  } else {
    if (probe(ctx, "vercel", ["project", "inspect", ctx.name]).status !== 0) {
      run(ctx, "vercel", ["project", "create", ctx.name]);
      notes.push(`Created project ${ctx.name}.`);
    }
    run(ctx, "vercel", ["link", "--yes", "--project", ctx.name]);
    notes.push("Linked.");
  }
  const env = readEnvLocal(ctx.appDir);
  const keys = DATABASE_KEYS.filter((key) => env.has(key));
  for (const key of keys) {
    // Value on stdin, never argv; --force makes a re-run overwrite in place.
    run(
      ctx,
      "vercel",
      [
        "env",
        "add",
        key,
        "--environment",
        "production,preview",
        "--sensitive",
        "--force",
        "--yes",
      ],
      env.get(key),
    );
  }
  notes.push(
    keys.length > 0
      ? `Set ${keys.join(", ")} for production and preview.`
      : "No database URLs in .env.local yet; env vars not set.",
  );
  return {
    step: "vercel",
    status: linked ? "exists" : "done",
    detail: notes.join(" "),
  };
}

const HANDLERS: Record<
  StepId,
  (ctx: ProvisionContext) => StepOutcome | Promise<StepOutcome>
> = {
  github,
  neon,
  vercel,
};

/**
 * Opt-in (`new --provision`). Each step is independent: a missing CLI, a
 * missing login or a failure is reported and the next step still runs. Steps
 * check before they create, so re-running in the same app is safe.
 */
export async function provision(ctx: ProvisionContext): Promise<StepOutcome[]> {
  const outcomes: StepOutcome[] = [];
  for (const step of STEPS) {
    let outcome: StepOutcome;
    if (!ctx.enabled[step] || (ctx.confirm && !(await ctx.confirm(step)))) {
      outcome = { step, status: "skipped", detail: "Skipped." };
    } else {
      try {
        outcome = await HANDLERS[step](ctx);
      } catch (error) {
        // StepError messages name the command; pg errors name no credentials.
        outcome = { step, status: "failed", detail: (error as Error).message };
      }
    }
    const line = `${step}: ${outcome.detail}`;
    if (outcome.status === "unavailable" || outcome.status === "failed")
      ctx.log.warn(line);
    else ctx.log.info(line);
    outcomes.push(outcome);
  }
  return outcomes;
}
