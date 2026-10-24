import { tmpdir } from "node:os";
import path from "node:path";

import { type Exec, runOrThrow } from "#cli/setup/exec";

export const INITIAL_COMMIT = "chore: scaffold from hipster-stack";

export interface SetupOptions {
  appDir: string;
  templateDir: string;
  install: boolean;
  git: boolean;
  exec: Exec;
  warn: (message: string) => void;
}

export interface SetupResult {
  committed: boolean;
}

/**
 * Local only: prisma validate, pnpm install (the registry is its one network
 * use; --no-install skips it), git init and the initial commit. Provisioning
 * is a separate opt-in step.
 */
export function setupApp({
  appDir,
  templateDir,
  install,
  git,
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
  if (!git) return { committed: false };

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
    return { committed: false };
  }
  return { committed: true };
}
