import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type TemplateSource = "HIPSTER_TEMPLATE" | "repo";

export interface ResolvedTemplate {
  dir: string;
  source: TemplateSource;
}

export class TemplateNotFoundError extends Error {
  constructor(dir: string, source: TemplateSource) {
    super(
      source === "HIPSTER_TEMPLATE"
        ? `HIPSTER_TEMPLATE points at ${dir}, which has no hipster.modules.json.`
        : `No template at ${dir}. Set HIPSTER_TEMPLATE to the Maximal Template directory.`,
    );
    this.name = "TemplateNotFoundError";
  }
}

/**
 * The CLI's own repo checkout: src/manifest (tsx) and dist (bundle) both sit
 * under packages/cli, so walk up to the folder that holds packages/.
 */
function repoTemplate(moduleUrl: string): string {
  let dir = path.dirname(fileURLToPath(moduleUrl));
  while (path.basename(dir) !== "packages") {
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve("template");
    dir = parent;
  }
  return path.join(path.dirname(dir), "template");
}

/** `HIPSTER_TEMPLATE`, else `<repo>/template`; must contain hipster.modules.json. */
export function resolveTemplate(
  env: Readonly<Record<string, string | undefined>> = process.env,
  moduleUrl: string = import.meta.url,
): ResolvedTemplate {
  const fromEnv = env.HIPSTER_TEMPLATE?.trim();
  const resolved: ResolvedTemplate = fromEnv
    ? { dir: path.resolve(fromEnv), source: "HIPSTER_TEMPLATE" }
    : { dir: repoTemplate(moduleUrl), source: "repo" };
  if (!existsSync(path.join(resolved.dir, "hipster.modules.json"))) {
    throw new TemplateNotFoundError(resolved.dir, resolved.source);
  }
  return resolved;
}
