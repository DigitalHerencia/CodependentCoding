#!/usr/bin/env node
/**
 * Stop hook. Blocks ending a session ONCE when working-tree files changed after the
 * last update to .claude/execution/handoff.json, reminding Claude to record
 * progress, decisions, and handoff. Never loops (respects stop_hook_active).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

const input = readStdin();
if (input.stop_hook_active) process.exit(0);

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const handoff = path.join(projectDir, ".claude", "execution", "handoff.json");

const git = spawnSync(
  "git",
  ["status", "--porcelain", "--untracked-files=all"],
  { cwd: projectDir, encoding: "utf8" },
);
if (git.status !== 0) process.exit(0); // not a git repo or git missing: do not block

const changed = git.stdout
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).replace(/^"|"$/g, "").split(" -> ").pop())
  .filter((file) => !file.startsWith(".claude/execution/"));

if (changed.length === 0) process.exit(0);

const handoffTime = fs.existsSync(handoff) ? fs.statSync(handoff).mtimeMs : 0;
const newer = changed.filter((file) => {
  const absolute = path.join(projectDir, file);
  return fs.existsSync(absolute) && fs.statSync(absolute).mtimeMs > handoffTime;
});

if (newer.length === 0) process.exit(0);

const list = newer
  .slice(0, 10)
  .map((f) => `  - ${f}`)
  .join("\n");
process.stderr.write(
  [
    "Files changed after the last handoff update:",
    list + (newer.length > 10 ? `\n  … ${newer.length - 10} more` : ""),
    "Before stopping, update .claude/execution/:",
    "  progress.json  - issue status + EXECUTED evidence (command → result)",
    "  decisions.json - append any decision made (DEC-NNN)",
    "  handoff.json   - current state, next issue, risks",
  ].join("\n") + "\n",
);
process.exit(2);
