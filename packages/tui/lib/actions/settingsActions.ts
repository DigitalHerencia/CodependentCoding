// Why: the settings screen's entry points: remember or forget an app folder; never throw.
import path from "node:path";

import { readGeneratedApp } from "@/lib/fetchers/appsFetchers";
import { forgetApp, rememberApp } from "@/lib/workflows/appsWorkflows";
import { appFolderSchema } from "@/schemas/settingsSchemas";
import type { ActionResult } from "@/types/actionTypes";

const failed = (error: unknown) =>
  ({
    ok: false,
    error: { code: "INTERNAL", message: (error as Error).message },
  }) as const;

/** Adds a folder that holds an app made by hipster-stack; returns the new list. */
export async function rememberAppAction(
  input: unknown,
): Promise<ActionResult<string[]>> {
  const parsed = appFolderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: parsed.error.issues.map((issue) => issue.message).join(" "),
      },
    };
  }
  try {
    const dir = path.resolve(parsed.data.dir);
    if (!(await readGeneratedApp(dir)).found) {
      return {
        ok: false,
        error: {
          code: "NOT_FOUND",
          message: `No hipster.json in ${dir}; pick a folder made by hipster-stack.`,
        },
      };
    }
    return { ok: true, data: await rememberApp(dir) };
  } catch (error) {
    return failed(error);
  }
}

export async function forgetAppAction(
  dir: string,
): Promise<ActionResult<string[]>> {
  try {
    return { ok: true, data: await forgetApp(dir) };
  } catch (error) {
    return failed(error);
  }
}
