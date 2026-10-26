import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { cliRoot } from "#cli/compose/governance";
import type { Exec } from "#cli/setup/exec";
import {
  enumName,
  type Field,
  type Names,
  pascal,
  relationName,
  toNames,
} from "#cli/slice/fields";
import {
  appendText,
  extendModule,
  loadTypeScript,
  mergeTs,
} from "#cli/slice/merge";
import {
  addRelationField,
  declaredTypes,
  findModel,
  readSchema,
  type SchemaFile,
} from "#cli/slice/prismaSchema";
import { render, type RefTarget, sliceTokens } from "#cli/slice/tokens";

export const SLICE_TEMPLATES = path.join(
  cliRoot(import.meta.url),
  "templates",
  "slice",
);

/** Icons the tenant shell can draw (types/moduleTypes.ts ModuleIcon). */
export const ICONS = [
  "brain",
  "briefcase",
  "building",
  "credit-card",
  "folder-kanban",
  "headphones",
  "megaphone",
  "users",
] as const;

export interface SliceOptions {
  appDir: string;
  entity: string;
  moduleId: string;
  fields: Field[];
  plural?: string | undefined;
  /** New modules only: nav group label and icon. */
  moduleLabel?: string | undefined;
  icon?: string | undefined;
}

export interface SlicePlan {
  names: Names;
  newModule: boolean;
  created: string[];
  updated: string[];
  /** Module-file entries that could not be placed automatically. */
  skipped: string[];
  dependsOn: string[];
  writes: Map<string, string>;
}

interface ManifestEntry {
  id: string;
  kind: "domain" | "addon";
  label: string;
  description?: string;
  dependsOn?: string[];
  owns?: string[];
  [key: string]: unknown;
}

interface Manifest {
  modules: ManifestEntry[];
  [key: string]: unknown;
}

/** Template → app path; `merge` files are appended to when they exist. */
function targets(
  names: Names,
): { template: string; target: string; merge: boolean }[] {
  const {
    module: m,
    entity: e,
    entities: es,
    Entities: Es,
    Entity: E,
    route,
    param,
  } = names;
  const feature = (file: string) => `features/${m}/${file}`;
  const page = `app/(tenant)/${route}`;
  return [
    {
      template: "schemas.ts.tpl",
      target: `schemas/${m}Schemas.ts`,
      merge: true,
    },
    { template: "types.ts.tpl", target: `types/${m}Types.ts`, merge: true },
    {
      template: "selects.ts.tpl",
      target: `lib/db/selects/${m}.selects.ts`,
      merge: true,
    },
    { template: "dto.ts.tpl", target: `lib/db/dto/${m}.dto.ts`, merge: true },
    {
      template: "fetchers.ts.tpl",
      target: `lib/fetchers/${m}Fetchers.ts`,
      merge: true,
    },
    {
      template: "actions.ts.tpl",
      target: `lib/actions/${m}Actions.ts`,
      merge: true,
    },
    {
      template: "listTemplate.tsx.tpl",
      target: `components/templates/${m}${Es}Template.tsx`,
      merge: false,
    },
    {
      template: "detailTemplate.tsx.tpl",
      target: `components/templates/${m}${E}DetailTemplate.tsx`,
      merge: false,
    },
    {
      template: "listFeature.tsx.tpl",
      target: feature(`${es}Feature.tsx`),
      merge: false,
    },
    {
      template: "listFeature.client.tsx.tpl",
      target: feature(`${es}Feature.client.tsx`),
      merge: false,
    },
    {
      template: "listSkeleton.tsx.tpl",
      target: feature(`${es}Skeleton.tsx`),
      merge: false,
    },
    {
      template: "detailFeature.tsx.tpl",
      target: feature(`${e}Feature.tsx`),
      merge: false,
    },
    {
      template: "detailSkeleton.tsx.tpl",
      target: feature(`${e}Skeleton.tsx`),
      merge: false,
    },
    {
      template: "newForm.tsx.tpl",
      target: feature(`${e}NewForm.tsx`),
      merge: false,
    },
    {
      template: "editFeature.tsx.tpl",
      target: feature(`${e}EditFeature.tsx`),
      merge: false,
    },
    {
      template: "formSkeleton.tsx.tpl",
      target: feature(`${e}FormSkeleton.tsx`),
      merge: false,
    },
    {
      template: "pages/list.tsx.tpl",
      target: `${page}/page.tsx`,
      merge: false,
    },
    {
      template: "pages/new.tsx.tpl",
      target: `${page}/new/page.tsx`,
      merge: false,
    },
    {
      template: "pages/detail.tsx.tpl",
      target: `${page}/[${param}]/page.tsx`,
      merge: false,
    },
    {
      template: "pages/edit.tsx.tpl",
      target: `${page}/[${param}]/edit/page.tsx`,
      merge: false,
    },
    {
      template: "actions.test.ts.tpl",
      target: `tests/${m}/${es}Actions.test.ts`,
      merge: false,
    },
  ];
}

const read = (appDir: string, file: string) => {
  const full = path.join(appDir, file);
  return existsSync(full) ? readFileSync(full, "utf8") : null;
};

/**
 * Plans a vertical slice (CC-032) without touching disk: every file it creates
 * or extends, the manifest and registry changes. Any conflict (an existing
 * model, route, file or declaration) throws before anything is written.
 */
export async function planSlice(options: SliceOptions): Promise<SlicePlan> {
  const { appDir, moduleId, fields } = options;
  if (!existsSync(path.join(appDir, "hipster.json"))) {
    throw new Error(
      `${appDir} is not a generated app (no hipster.json). Run slice inside an app made by \`hipster-stack new\`.`,
    );
  }
  if (!/^[a-z][a-z0-9]*$/.test(moduleId)) {
    throw new Error(
      `--module must be lowercase letters and digits (got "${moduleId}").`,
    );
  }
  const names = toNames(options.entity, moduleId, options.plural);
  const manifestText = read(appDir, "hipster.modules.json") as string;
  const manifest = JSON.parse(manifestText) as Manifest;
  const existingModule = manifest.modules.find(({ id }) => id === moduleId);
  if (existingModule && existingModule.kind !== "domain") {
    throw new Error(
      `"${moduleId}" is an add-on; slices belong to domain modules.`,
    );
  }

  const schema = readSchema(appDir);
  const types = declaredTypes(schema);
  const generatedTypes = [
    names.Entity,
    ...fields.filter((f) => f.type === "enum").map((f) => enumName(names, f)),
  ];
  const taken = generatedTypes.filter((name) => types.has(name));
  if (taken.length > 0)
    throw new Error(`The schema already declares ${taken.join(", ")}.`);

  const refTargets = new Map<string, RefTarget>();
  const dependsOn = new Set(existingModule?.dependsOn ?? []);
  const relationEdits: { model: string; line: string }[] = [];
  for (const field of fields.filter((f) => f.type === "ref")) {
    const model = field.model as string;
    if (model === names.Entity)
      throw new Error("A slice cannot reference its own model yet.");
    const block = findModel(schema, model);
    if (!block)
      throw new Error(`ref(${model}): no model ${model} in prisma/schema.`);
    if (!block.tenant && model !== "User") {
      throw new Error(
        `ref(${model}): only tenant models (with organizationId) and User can be referenced.`,
      );
    }
    if (!block.fields.includes("id"))
      throw new Error(`ref(${model}): the model has no id field.`);
    refTargets.set(model, { model, tenant: block.tenant });
    if (block.file.owner !== "base" && block.file.owner !== moduleId)
      dependsOn.add(block.file.owner);
    const relation = relationName(field);
    const back = `${names.entities}As${pascal(relation)}`;
    if (block.fields.includes(back))
      throw new Error(`model ${model} already has a field ${back}.`);
    relationEdits.push({
      model,
      line: `${back} ${names.Entity}[] @relation("${names.Entity}${pascal(relation)}")`,
    });
  }
  const organization = findModel(schema, "Organization");
  if (!organization) throw new Error("No Organization model in prisma/schema.");
  if (organization.fields.includes(names.entities)) {
    throw new Error(
      `model Organization already has a field ${names.entities}.`,
    );
  }

  const tokens = sliceTokens(names, fields, refTargets, {
    icon: options.icon ?? "briefcase",
    moduleLabel:
      options.moduleLabel ?? existingModule?.label ?? pascal(moduleId),
  });
  const template = (file: string) =>
    render(
      readFileSync(path.join(SLICE_TEMPLATES, file), "utf8"),
      tokens,
      file,
    );

  const ts = loadTypeScript(appDir);
  const writes = new Map<string, string>();
  const created: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];
  const put = (file: string, text: string, isNew: boolean) => {
    writes.set(file, text);
    (isNew ? created : updated).push(file);
  };

  if (existsSync(path.join(appDir, "app", "(tenant)", names.route))) {
    throw new Error(
      `app/(tenant)/${names.route} already exists; pass --plural to use another route.`,
    );
  }
  for (const { template: file, target, merge } of targets(names)) {
    const current = read(appDir, target);
    if (current === null) put(target, template(file), true);
    else if (merge)
      put(target, mergeTs(ts, current, template(file), target), false);
    else throw new Error(`${target} already exists.`);
  }

  // Prisma: model + enums in the module's schema file, back-relations tagged.
  const schemaFile = `prisma/schema/${moduleId}.prisma`;
  const files = new Map<string, SchemaFile>(
    schema.map((file) => [file.file, file]),
  );
  const textOf = (file: string) =>
    writes.get(file) ?? files.get(file)?.text ?? null;
  const model = template("model.prisma.tpl");
  const currentSchema = textOf(schemaFile);
  put(
    schemaFile,
    currentSchema === null ? model : appendText(currentSchema, model),
    currentSchema === null,
  );
  const back: { file: string; model: string; line: string }[] = [
    {
      file: organization.file.file,
      model: "Organization",
      line: `${names.entities} ${names.Entity}[]`,
    },
    ...relationEdits.map((edit) => ({
      ...edit,
      file: (findModel(schema, edit.model) as { file: SchemaFile }).file.file,
    })),
  ];
  for (const edit of back) {
    const isNew = !writes.has(edit.file);
    writes.set(
      edit.file,
      addRelationField(
        textOf(edit.file) as string,
        edit.model,
        edit.line,
        moduleId,
      ),
    );
    if (isNew) updated.push(edit.file);
  }

  const rlsFile = `prisma/rls/${moduleId}.sql`;
  const rls = template("rls.sql.tpl");
  const currentRls = read(appDir, rlsFile);
  put(
    rlsFile,
    currentRls === null ? rls : appendText(currentRls, rls),
    currentRls === null,
  );

  // Module definition, manifest and registry.
  const moduleFile = `lib/modules/${moduleId}.module.ts`;
  const currentModule = read(appDir, moduleFile);
  if (existingModule && currentModule !== null) {
    const extended = extendModule(
      ts,
      currentModule,
      { label: names.labelPlural, href: `/${names.route}` },
      names.resource,
    );
    skipped.push(...extended.skipped);
    put(moduleFile, extended.text, false);
  } else if (!existingModule) {
    if (currentModule !== null)
      throw new Error(
        `${moduleFile} exists but "${moduleId}" is not in hipster.modules.json.`,
      );
    put(moduleFile, template("module.ts.tpl"), true);
  } else {
    throw new Error(
      `"${moduleId}" is in hipster.modules.json but ${moduleFile} is missing.`,
    );
  }

  const owns = `app/(tenant)/${names.route}/**`;
  const entry: ManifestEntry = existingModule
    ? { ...existingModule }
    : {
        id: moduleId,
        kind: "domain",
        label: options.moduleLabel ?? pascal(moduleId),
        description: `${names.labelPlural} (hipster-stack slice)`,
        dependsOn: [],
        owns: [],
      };
  entry.owns = [...new Set([...(entry.owns ?? []), owns])];
  entry.dependsOn = [...dependsOn].sort();
  const nextManifest: Manifest = {
    ...manifest,
    modules: existingModule
      ? manifest.modules.map((module) =>
          module.id === moduleId ? entry : module,
        )
      : [...manifest.modules, entry],
  };
  const schemaScript = (await import(
    pathToFileURL(path.join(appDir, "scripts", "modules-schema.mjs")).href
  )) as {
    validateManifest: (
      input: unknown,
    ) => { ok: true } | { ok: false; errors: string[] };
  };
  const valid = schemaScript.validateManifest(nextManifest);
  if (!valid.ok)
    throw new Error(
      `The updated manifest is invalid:\n${valid.errors.join("\n")}`,
    );
  put(
    "hipster.modules.json",
    `${JSON.stringify(nextManifest, null, 2)}\n`,
    false,
  );

  if (!existingModule) {
    const compose = (await import(
      pathToFileURL(path.join(appDir, "scripts", "compose.mjs")).href
    )) as {
      renderRegistry: (ids: string[]) => string;
    };
    put(
      "lib/modules/registry.ts",
      compose.renderRegistry(nextManifest.modules.map(({ id }) => id)),
      false,
    );
  }

  return {
    names,
    newModule: !existingModule,
    created,
    updated,
    skipped,
    dependsOn: entry.dependsOn,
    writes,
  };
}

export function writePlan(appDir: string, plan: SlicePlan): void {
  for (const [file, text] of plan.writes) {
    const full = path.join(appDir, file);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, text);
  }
}

/** prisma format, Prettier and eslint --fix on what the slice wrote (the app's own tools). */
export function formatPlan(
  appDir: string,
  plan: SlicePlan,
  exec: Exec,
): string[] {
  const failures: string[] = [];
  const run = (args: string[]) => {
    const { status } = exec("pnpm", ["exec", ...args], { cwd: appDir });
    if (status !== 0) failures.push(`pnpm exec ${args.slice(0, 2).join(" ")}`);
  };
  const files = [...plan.writes.keys()];
  run(["prisma", "format"]);
  run(["prisma", "generate"]);
  run([
    "prettier",
    "--write",
    ...files.filter(
      (file) => !file.endsWith(".prisma") && !file.endsWith(".sql"),
    ),
  ]);
  run(["eslint", "--fix", ...files.filter((file) => /\.tsx?$/.test(file))]);
  return failures;
}
