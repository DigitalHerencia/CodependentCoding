import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { applyBrandColor, type BrandResult } from "#cli/compose/brand";
import { writeGovernance } from "#cli/compose/governance";
import { loadTemplateKit } from "#cli/compose/kit";
import { prunePackageJson } from "#cli/compose/packageJson";

/**
 * Not copied: a new app starts its own migration history (`pnpm db:init`),
 * tests/template/ pins the Maximal Template's full module set, and .claude/ is
 * the template's own governance (the app gets assets/app-governance instead).
 */
export const EXCLUDED = [".claude/", "prisma/migrations/", "tests/template/"];

/** Files the pipeline writes or rewrites; formatted before it returns. */
const FORMATTED = [
  "hipster.json",
  "hipster.modules.json",
  "lib/modules/registry.ts",
  "package.json",
];

const NPM_NAME = /^[a-z0-9][a-z0-9._~-]*$/;

export function isValidAppName(name: string): boolean {
  return name.length <= 214 && NPM_NAME.test(name);
}

/** `My Demo App` → `my-demo-app`. */
export function toAppName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._~-]+/g, "-")
    .replace(/^[-._~]+|-+$/g, "");
}

export interface ComposeAppOptions {
  templateDir: string;
  outDir: string;
  /** Requested modules; the dependsOn closure is added. */
  modules: readonly string[];
  name: string;
  /** Brand hex; null keeps the template's reviewed default tokens. */
  color: string | null;
  cliVersion: string;
  now: Date;
}

export interface ComposeAppResult {
  modules: string[];
  files: number;
  removed: number;
  removedPackages: string[];
  governance: string[];
  brand: BrandResult | null;
}

interface ManifestEntry {
  id: string;
  kind: string;
  dependsOn?: string[];
  packages?: string[];
}

export interface TemplateManifest {
  modules: ManifestEntry[];
  presets: Record<string, string[]>;
}

export function readManifest(templateDir: string): TemplateManifest {
  return JSON.parse(
    readFileSync(path.join(templateDir, "hipster.modules.json"), "utf8"),
  ) as TemplateManifest;
}

export function templateCommit(templateDir: string): string | null {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: templateDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * The file steps of `new` (Architecture.md §6), deterministic for the same
 * inputs: closure, copy without unselected modules' files, strip tags,
 * registry, manifest, .env.example (template compose.mjs), then prune
 * package.json, brand color and hipster.json. No network, no install.
 */
export async function composeApp(
  options: ComposeAppOptions,
): Promise<ComposeAppResult> {
  const { templateDir, outDir, name, color } = options;
  if (!isValidAppName(name)) {
    throw new Error(
      `"${name}" is not a valid package name (lowercase letters, digits, . _ ~ -).`,
    );
  }
  if (existsSync(outDir) && readdirSync(outDir).length > 0) {
    throw new Error(`${outDir} is not empty.`);
  }

  const kit = await loadTemplateKit(templateDir);
  const raw = readManifest(templateDir);
  const valid = kit.schema.validateManifest(raw);
  if (!valid.ok) {
    throw new Error(
      `hipster.modules.json is invalid: ${valid.errors.join("; ")}`,
    );
  }
  const ids = kit.compose.closure(raw, [...options.modules]);
  const { files, removed } = kit.compose.compose(templateDir, outDir, ids, {
    exclude: EXCLUDED,
  });

  const pkgPath = path.join(outDir, "package.json");
  const pruned = prunePackageJson(
    JSON.parse(readFileSync(pkgPath, "utf8")),
    raw,
    ids,
    name,
  );
  writeFileSync(pkgPath, JSON.stringify(pruned.pkg));

  const commit = templateCommit(templateDir);
  const governance = await writeGovernance(
    outDir,
    {
      appName: name,
      modules: ids,
      color,
      templateCommit: commit,
      now: options.now,
    },
    kit.format,
  );

  let brand: BrandResult | null = null;
  if (color) {
    const cssPath = path.join(outDir, "app", "globals.css");
    brand = applyBrandColor(readFileSync(cssPath, "utf8"), color);
    writeFileSync(cssPath, brand.css);
  }

  const hipster = {
    template: { commit, path: templateDir },
    cli: options.cliVersion,
    createdAt: options.now.toISOString(),
    modules: ids,
    color,
  };
  writeFileSync(path.join(outDir, "hipster.json"), JSON.stringify(hipster));

  // Everything the pipeline wrote, in the app's own Prettier style.
  for (const file of FORMATTED) {
    const target = path.join(outDir, file);
    writeFileSync(target, await kit.format(file, readFileSync(target, "utf8")));
  }

  return {
    modules: ids,
    files,
    removed,
    removedPackages: pruned.removed,
    governance,
    brand,
  };
}
