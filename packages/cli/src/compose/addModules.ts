import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  EXCLUDED,
  readManifest,
  templateCommit,
} from "#cli/compose/composeApp";
import { loadTemplateKit } from "#cli/compose/kit";

const REGISTRY = "lib/modules/registry.ts";
const MANIFEST = "hipster.modules.json";
const ENV_EXAMPLE = ".env.example";
/** Rebuilt from the merged manifest rather than copied. */
const GENERATED = new Set([REGISTRY, MANIFEST, ENV_EXAMPLE]);

const TAG = /\/\/ @module (\w+)\s*$/;
const BLOCK = /^(model|enum|type|view)\s+\w+\s*\{/;

interface ManifestEntry {
  id: string;
  packages?: string[];
  env?: { name: string }[];
}

interface AppManifest {
  modules: ManifestEntry[];
  [key: string]: unknown;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

interface HipsterJson {
  template?: { commit?: string | null };
  modules: string[];
  [key: string]: unknown;
}

export interface AddOptions {
  appDir: string;
  templateDir: string;
  /** Requested modules; their dependsOn closure is added. */
  modules: readonly string[];
}

export interface AddPlan {
  /** Modules new to the app, in manifest order (closure included). */
  added: string[];
  created: string[];
  updated: string[];
  /** Dependencies added to package.json. */
  packages: string[];
  /** Env variables the added modules declare. */
  env: string[];
  /** The template moved since the app was generated (hipster.json commit). */
  drift: { from: string; to: string } | null;
  writes: Map<string, string>;
}

const read = (file: string) =>
  existsSync(file) ? readFileSync(file, "utf8") : null;

function walk(root: string, dir = ""): string[] {
  return readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(
    (entry) => {
      const relative = path.posix.join(dir, entry.name);
      return entry.isDirectory() ? walk(root, relative) : [relative];
    },
  );
}

/**
 * Re-inserts the `// @module <added>` lines a schema file regains, each after
 * the line that precedes it in the template, inside the same block, so lines
 * the app added (slices) stay. Null when a block the line belongs to is gone.
 */
export function restoreTagged(
  appText: string,
  templateText: string,
  added: ReadonlySet<string>,
): string | null {
  const lines = appText.split("\n");
  let block: string | null = null;
  // Last non-blank template line: blank lines are no anchor.
  let previous: string | null = null;
  let gap = false;
  for (const line of templateText.split("\n")) {
    const tag = TAG.exec(line);
    if (tag && added.has(tag[1] as string) && !lines.includes(line)) {
      const start = block === null ? -1 : lines.indexOf(block);
      if (block !== null && start === -1) return null;
      const end =
        start === -1
          ? lines.length
          : lines.findIndex((other, index) => index > start && other === "}");
      if (end === -1) return null;
      const anchor =
        previous === null ? -1 : lines.indexOf(previous, start + 1);
      const at = anchor !== -1 && anchor < end ? anchor + 1 : end;
      // A group the template separates with a blank line stays separated.
      const separate = gap && at - 1 !== start && lines[at - 1]?.trim() !== "";
      lines.splice(at, 0, ...(separate ? ["", line] : [line]));
    }
    if (BLOCK.test(line)) block = line;
    else if (line === "}") block = null;
    if (line.trim() === "") {
      gap = true;
    } else {
      previous = line;
      gap = false;
    }
  }
  return lines.join("\n");
}

function addPackages(
  app: PackageJson,
  template: PackageJson,
  wanted: readonly string[],
): { pkg: PackageJson; added: string[] } {
  const next: PackageJson = { ...app };
  const added: string[] = [];
  for (const section of ["dependencies", "devDependencies"] as const) {
    const source = template[section] ?? {};
    const current = { ...(app[section] ?? {}) };
    const missing = wanted.filter(
      (dep) =>
        source[dep] &&
        !(dep in current) &&
        !(dep in (app.dependencies ?? {})) &&
        !(dep in (app.devDependencies ?? {})),
    );
    if (missing.length === 0) continue;
    missing.forEach((dep) => (current[dep] = source[dep] as string));
    next[section] = Object.fromEntries(
      Object.entries(current).sort(([a], [b]) => a.localeCompare(b)),
    );
    added.push(...missing);
  }
  return { pkg: next, added: added.sort() };
}

/**
 * Plans `add` (CC-033) without touching the app: composes the template for
 * the app's current modules and for current + added, and carries the
 * difference into the app. Base files are untouched (they are the same in
 * both); module files are new; schema files regain their tagged lines;
 * registry, manifest and .env.example are rebuilt. A file the app changed or
 * created where the module would write is a conflict, and conflicts throw
 * before anything is written.
 */
export async function planAdd(options: AddOptions): Promise<AddPlan> {
  const { appDir, templateDir } = options;
  const hipsterText = read(path.join(appDir, "hipster.json"));
  if (hipsterText === null) {
    throw new Error(
      `${appDir} is not a generated app (no hipster.json). Run add inside an app made by \`hipster-stack new\`.`,
    );
  }
  const hipster = JSON.parse(hipsterText) as HipsterJson;
  const appManifest = JSON.parse(
    readFileSync(path.join(appDir, MANIFEST), "utf8"),
  ) as AppManifest;

  const kit = await loadTemplateKit(templateDir);
  const template = readManifest(templateDir);
  const templateIds = new Set(template.modules.map(({ id }) => id));
  const installed = appManifest.modules
    .map(({ id }) => id)
    .filter((id) => templateIds.has(id));
  const target = kit.compose.closure(template, [
    ...installed,
    ...options.modules,
  ]);
  const added = target.filter((id) => !installed.includes(id));

  const commit = templateCommit(templateDir);
  const from = hipster.template?.commit ?? null;
  const drift = from && commit && from !== commit ? { from, to: commit } : null;
  const plan: AddPlan = {
    added,
    created: [],
    updated: [],
    packages: [],
    env: [],
    drift,
    writes: new Map(),
  };
  if (added.length === 0) return plan;

  const addedSet = new Set(added);
  const scratch = mkdtempSync(path.join(tmpdir(), "hipster-add-"));
  try {
    const before = path.join(scratch, "before");
    const after = path.join(scratch, "after");
    kit.compose.compose(templateDir, before, installed, { exclude: EXCLUDED });
    kit.compose.compose(templateDir, after, target, { exclude: EXCLUDED });

    const conflicts: string[] = [];
    for (const file of walk(after).sort()) {
      if (GENERATED.has(file)) continue;
      const next = readFileSync(path.join(after, file), "utf8");
      const previous = read(path.join(before, file));
      if (previous === next) continue;
      const current = read(path.join(appDir, file));
      if (current === next) continue;
      if (previous === null) {
        if (current === null) {
          plan.created.push(file);
          plan.writes.set(file, next);
        } else {
          conflicts.push(`${file} (exists in the app)`);
        }
        continue;
      }
      if (current === null) {
        conflicts.push(`${file} (deleted in the app)`);
      } else if (file.endsWith(".prisma")) {
        const merged = restoreTagged(current, next, addedSet);
        if (merged === null) {
          conflicts.push(`${file} (a model the module extends is gone)`);
        } else if (merged !== current) {
          plan.updated.push(file);
          plan.writes.set(file, merged);
        }
      } else if (current === previous) {
        plan.updated.push(file);
        plan.writes.set(file, next);
      } else {
        conflicts.push(`${file} (changed in the app)`);
      }
    }
    if (conflicts.length > 0) {
      throw new Error(
        `add ${added.join(", ")} would overwrite files the app changed:\n${conflicts
          .map((line) => `  - ${line}`)
          .join("\n")}\nMove or revert them, then run add again.`,
      );
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }

  // Template modules in template order, then the app's own (slice) modules.
  const appEntries = new Map(
    appManifest.modules.map((entry) => [entry.id, entry]),
  );
  const modules = [
    ...template.modules
      .filter(({ id }) => target.includes(id))
      .map((entry) => appEntries.get(entry.id) ?? entry),
    ...appManifest.modules.filter(({ id }) => !templateIds.has(id)),
  ];
  const manifest = { ...appManifest, modules };
  const valid = kit.schema.validateManifest(manifest);
  if (!valid.ok) {
    throw new Error(
      `The merged hipster.modules.json is invalid: ${valid.errors.join("; ")}`,
    );
  }
  const ids = modules.map(({ id }) => id);
  const update = async (file: string, text: string, format = true) => {
    const next = format ? await kit.format(file, text) : text;
    if (next === read(path.join(appDir, file))) return;
    plan.writes.set(file, next);
    plan.updated.push(file);
  };
  await update(MANIFEST, JSON.stringify(manifest));
  await update(REGISTRY, kit.compose.renderRegistry(ids));
  await update(ENV_EXAMPLE, kit.env.renderEnvExample(valid.manifest), false);

  const addedEntries = template.modules.filter(({ id }) =>
    addedSet.has(id),
  ) as ManifestEntry[];
  const packages = addPackages(
    JSON.parse(
      readFileSync(path.join(appDir, "package.json"), "utf8"),
    ) as PackageJson,
    JSON.parse(
      readFileSync(path.join(templateDir, "package.json"), "utf8"),
    ) as PackageJson,
    addedEntries.flatMap((entry) => entry.packages ?? []),
  );
  if (packages.added.length > 0) {
    plan.packages = packages.added;
    await update("package.json", JSON.stringify(packages.pkg));
  }
  plan.env = addedEntries.flatMap((entry) =>
    (entry.env ?? []).map(({ name }) => name),
  );

  await update("hipster.json", JSON.stringify({ ...hipster, modules: target }));
  return plan;
}

export function writeAdd(appDir: string, plan: AddPlan): void {
  for (const [file, text] of plan.writes) {
    const target = path.join(appDir, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, text);
  }
}
