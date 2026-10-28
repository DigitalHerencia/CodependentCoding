// Why: data runtime: the Codependent Coding checkout on disk is this app's database.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
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
