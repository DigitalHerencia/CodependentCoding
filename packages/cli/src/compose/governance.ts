import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** packages/cli, found from src/compose (tsx) or dist (bundle). */
function cliRoot(moduleUrl: string): string {
  let dir = path.dirname(fileURLToPath(moduleUrl));
  for (;;) {
    const pkg = path.join(dir, "package.json");
    if (
      existsSync(pkg) &&
      (JSON.parse(readFileSync(pkg, "utf8")) as { name?: string }).name ===
        "hipster-stack"
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error("hipster-stack package.json not found");
    dir = parent;
  }
}

export const GOVERNANCE_DIR = path.join(
  cliRoot(import.meta.url),
  "assets",
  "app-governance",
);

export interface GovernanceVars {
  appName: string;
  modules: readonly string[];
  color: string | null;
  templateCommit: string | null;
  now: Date;
}

function walk(dir: string, base = dir): string[] {
  return readdirSync(dir)
    .sort()
    .flatMap((name) => {
      const full = path.join(dir, name);
      return statSync(full).isDirectory()
        ? walk(full, base)
        : [path.relative(base, full).split(path.sep).join("/")];
    });
}

/** Asset paths relative to the app root, e.g. `context/docs/PRD.md`. */
export function governanceFiles(): string[] {
  return walk(GOVERNANCE_DIR);
}

export function renderGovernance(text: string, vars: GovernanceVars): string {
  const values: Record<string, string> = {
    appName: vars.appName,
    createdAt: vars.now.toISOString().slice(0, 10),
    modules:
      vars.modules.length > 0 ? vars.modules.join(", ") : "none (base only)",
    modulesList: `[${vars.modules.join(", ")}]`,
    templateCommit: vars.templateCommit ?? "unknown",
    color: vars.color ?? "the template default",
    colorYaml: vars.color ? `"${vars.color}"` : "null",
  };
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`unknown placeholder ${match}`);
    return value;
  });
}

/**
 * Writes the app's governance (CLAUDE.md, context/docs, .claude contracts and
 * execution state, issue README) from assets/app-governance. `new` calls it
 * once; `add` never does, so the owner's edits are never overwritten.
 */
export async function writeGovernance(
  outDir: string,
  vars: GovernanceVars,
  format: (relativePath: string, text: string) => Promise<string>,
): Promise<string[]> {
  const files = governanceFiles();
  for (const file of files) {
    const target = path.join(outDir, file);
    if (existsSync(target))
      throw new Error(`${file} already exists in ${outDir}`);
    mkdirSync(path.dirname(target), { recursive: true });
    const rendered = renderGovernance(
      readFileSync(path.join(GOVERNANCE_DIR, file), "utf8"),
      vars,
    );
    writeFileSync(target, await format(file, rendered));
  }
  return files;
}
