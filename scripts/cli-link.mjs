/**
 * Links packages/cli globally so `hipster-stack` runs from any directory.
 * pnpm resolves a relative `link:` against its global dir, so pass an absolute
 * path. Needs pnpm's global bin dir on PATH (`pnpm setup` once per machine).
 *
 *   pnpm cli:link
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../packages/cli", import.meta.url));

const { status } = spawnSync("pnpm", ["add", "--global", `link:${cli}`], {
  stdio: "inherit",
  // pnpm is pnpm.cmd on Windows, which needs a shell.
  shell: process.platform === "win32",
});
process.exit(status ?? 1);
