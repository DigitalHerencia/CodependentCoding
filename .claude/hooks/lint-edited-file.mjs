#!/usr/bin/env node
/**
 * PostToolUse hook (Edit | Write | MultiEdit).
 * Lints the edited file with the owning project's ESLint config (root or template/)
 * and feeds doctrine findings (CC-*) back to Claude by exiting 2.
 * Cross-platform: no shell, resolves ESLint from node_modules directly.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const LINTABLE = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const MAX_LINES = 40;

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

const input = readStdin();
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const filePath = input.tool_input?.file_path;

if (!filePath || !LINTABLE.test(filePath)) process.exit(0);

const absolute = path.resolve(projectDir, filePath);
if (!fs.existsSync(absolute)) process.exit(0);

const relative = path.relative(projectDir, absolute).split(path.sep).join("/");
if (
  relative.startsWith("..") ||
  /(^|\/)(node_modules|\.next|generated|dist)\//.test(relative)
)
  process.exit(0);

// The template is its own pnpm project with its own lint contract.
const lintRoot = relative.startsWith("template/")
  ? path.join(projectDir, "template")
  : projectDir;
const eslintBin = path.join(
  lintRoot,
  "node_modules",
  "eslint",
  "bin",
  "eslint.js",
);
if (!fs.existsSync(eslintBin)) process.exit(0); // dependencies not installed yet

const result = spawnSync(
  process.execPath,
  [eslintBin, "--no-warn-ignored", "--max-warnings=0", absolute],
  {
    cwd: lintRoot,
    encoding: "utf8",
    timeout: 80_000,
  },
);

if (result.status === 0) process.exit(0);

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`
  .trim()
  .split(/\r?\n/);
const shown = output.slice(0, MAX_LINES).join("\n");
const more =
  output.length > MAX_LINES
    ? `\n… ${output.length - MAX_LINES} more lines`
    : "";

process.stderr.write(
  `ESLint findings in ${relative}. Fix the cause (doctrine IDs are explained in .claude/contracts/validation.yaml); do not disable rules.\n${shown}${more}\n`,
);
process.exit(2);
