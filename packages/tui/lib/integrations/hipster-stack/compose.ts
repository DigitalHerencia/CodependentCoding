// Why: the hipster-stack CLI's compose engine, so the terminal app and `hipster-stack new` make the same app.
import path from "node:path";

import { composeApp, toAppName } from "hipster-stack/compose";
import { quietExec } from "@/lib/integrations/hipster-stack/exec";
import cli from "hipster-stack/package.json" with { type: "json" };
import { INITIAL_COMMIT, setupApp } from "hipster-stack/setup";

import type { NewAppRequest } from "@/types/appsTypes";

export { INITIAL_COMMIT };

/** Copies the template with the preset's modules; no install, no git. */
export async function composeNewApp(
  request: NewAppRequest,
  templateDir: string,
  modules: string[],
): Promise<string[]> {
  const outDir = path.resolve(request.appDir);
  const result = await composeApp({
    templateDir,
    outDir,
    modules,
    name: toAppName(path.basename(outDir)),
    color: request.color ? request.color.toLowerCase() : null,
    access: {
      tenancy: request.tenancy,
      accessControl: request.accessControl,
    },
    cliVersion: cli.version,
    now: new Date(),
  });
  return result.modules;
}

/** `prisma validate` against the new app's schema, using the template's Prisma. */
export function validateNewApp(appDir: string, templateDir: string): void {
  setupApp({
    appDir: path.resolve(appDir),
    templateDir,
    install: false,
    git: false,
    exec: quietExec,
    warn: () => undefined,
  });
}
