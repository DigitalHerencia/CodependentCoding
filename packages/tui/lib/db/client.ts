// Why: data runtime: the Codependent Coding checkout on disk is this app's database.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { tuiEnv } from "@/lib/env/tui";

const MARKER = "template/eslint/doctrine-map.mjs";

/** The checkout root: CODEPENDENT_ROOT, else the nearest folder above `start` holding the template. */
export function workspaceRoot(start: string = process.cwd()): string {
  if (tuiEnv.CODEPENDENT_ROOT) return path.resolve(tuiEnv.CODEPENDENT_ROOT);
  let dir = path.resolve(start);
  for (;;) {
    if (existsSync(path.join(dir, MARKER))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir)
      throw new Error(
        `No Codependent Coding checkout above ${start} (looked for ${MARKER}). Run inside one or set CODEPENDENT_ROOT.`,
      );
    dir = parent;
  }
}

export function readWorkspaceText(rel: string): Promise<string> {
  return readFile(path.join(workspaceRoot(), rel), "utf8");
}

export async function importWorkspaceModule<T>(rel: string): Promise<T> {
  return (await import(
    pathToFileURL(path.join(workspaceRoot(), rel)).href
  )) as T;
}

/** The terminal app's own settings file (not part of any checkout). */
export function settingsFile(): string {
  return path.join(
    path.resolve(
      tuiEnv.CODEPENDENT_HOME ?? path.join(os.homedir(), ".codependent"),
    ),
    "settings.json",
  );
}

/** A file's text, or null when it does not exist. */
export async function readTextIfPresent(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
