import { tmpdir } from "node:os";
import path from "node:path";

import { type Exec, runOrThrow } from "#cli/setup/exec";

export const INITIAL_COMMIT = "chore: scaffold from hipster-stack";

export interface SetupOptions {
  appDir: string;
  templateDir: string;
  install: boolean;
  git: boolean;
  /** .env.local has the database URLs: run `pnpm db:init` before the commit. */
  dbInit?: boolean;
  exec: Exec;
  warn: (message: string) => void;
}

export interface SetupResult {
  committed: boolean;
  /** prisma/migrations exists, so `pnpm test:rls` can run. */
  migrated: boolean;
}

/**
 * Local only: prisma validate, pnpm install (the registry is its one network
 * use; --no-install skips it), `pnpm db:init` when a database is wired (so the
 * initial commit carries prisma/migrations), git init and the initial commit.
 * Provisioning is a separate opt-in step.
 */
export function setupApp({
  appDir,
  templateDir,
  install,
  git,
  dbInit = false,
  exec,
  warn,
}: SetupOptions): SetupResult {
  // The template's own Prisma; cwd outside the app so its prisma.config.ts
  // (which needs the app's dependencies) is not loaded before install.
  runOrThrow(
    exec,
    process.execPath,
    [
      path.join(templateDir, "node_modules", "prisma", "build", "index.js"),
      "validate",
      "--schema",
      path.join(appDir, "prisma", "schema"),
    ],
    tmpdir(),
  );
  // Pruning changed package.json, so the copied lockfile must be updated.
  if (install)
    runOrThrow(exec, "pnpm", ["install", "--no-frozen-lockfile"], appDir);
  let migrated = false;
  if (install && dbInit) {
    migrated = exec("pnpm", ["db:init"], { cwd: appDir }).status === 0;
    if (!migrated)
      warn(
        "`pnpm db:init` failed. Check the database URLs in .env.local, run `pnpm db:init`, then commit prisma/migrations.",
      );
  }
  if (!git) return { committed: false, migrated };

  runOrThrow(exec, "git", ["init", "--quiet"], appDir);
  runOrThrow(exec, "git", ["add", "--all"], appDir);
  const commit = exec("git", ["commit", "--quiet", "-m", INITIAL_COMMIT], {
    cwd: appDir,
  });
  if (commit.status !== 0) {
    // Usually no git identity yet; the files are staged and nothing is lost.
    warn(
      `Initial commit failed. Set \`git config --global user.name\` and \`user.email\`, then run \`git commit -m "${INITIAL_COMMIT}"\` in the app.`,
    );
    return { committed: false, migrated };
  }
  return { committed: true, migrated };
}
