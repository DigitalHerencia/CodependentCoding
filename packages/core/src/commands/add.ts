import { access, cp, mkdir, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import type {
  CapabilityId,
  ModuleSelection,
  NormalizedRecipe,
} from '@loaded-vibes/schema';
import { LoadedVibesError } from '../errors.js';
import { generatedModuleIds, type GeneratedModuleId } from '../modules.js';
import {
  parseGenerationManifest,
  type GenerationManifest,
} from '../manifest.js';
import { resolveRecipe } from '../recipe.js';
import { writeRecipeArtifacts } from '../generator/transforms.js';
import { resolveTemplateDirectory } from './create.js';

interface ModuleMetadata {
  id: GeneratedModuleId;
  contributions: string[];
  replaces: string[];
  setup: string[];
}

export interface ModuleAdditionPlan {
  targetDirectory: string;
  module: GeneratedModuleId;
  addedCapabilities: CapabilityId[];
  prerequisites: CapabilityId[];
  files: string[];
  replacements: string[];
  setup: string[];
  nextRecipe: NormalizedRecipe;
  manifest: GenerationManifest;
  sourceDirectory: string;
  templateDirectory: string;
}

export interface ModuleAdditionResult {
  module: GeneratedModuleId;
  addedCapabilities: CapabilityId[];
  prerequisites: CapabilityId[];
  filesAdded: string[];
  filesReplaced: string[];
  setup: string[];
}

const moduleCapabilities = {
  marketing: 'marketing',
  'sample-domain': 'sampleDomain',
  'stripe-connect': 'stripeConnect',
} as const satisfies Record<GeneratedModuleId, CapabilityId>;

function isEnabled(recipe: NormalizedRecipe, id: CapabilityId): boolean {
  return id === 'sampleDomain'
    ? recipe.modules.sampleDomain !== false
    : recipe.modules[id];
}

function parseModuleId(value: string): GeneratedModuleId {
  if ((generatedModuleIds as readonly string[]).includes(value))
    return value as GeneratedModuleId;
  throw new LoadedVibesError(
    'MODULE_UNSUPPORTED',
    `Unsupported module "${value}". Supported modules: ${generatedModuleIds.join(', ')}.`,
  );
}

async function readJson(file: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as unknown;
  } catch (error) {
    throw new LoadedVibesError(
      'PROJECT_NOT_GENERATED',
      `Unable to read generated project metadata at ${file}.`,
      error,
    );
  }
}

async function readModuleMetadata(
  sourceDirectory: string,
  expectedId: GeneratedModuleId,
): Promise<ModuleMetadata> {
  const value = (await readJson(
    path.join(sourceDirectory, '.loaded-vibes-module.json'),
  )) as Partial<ModuleMetadata>;
  if (value.id !== expectedId || !Array.isArray(value.contributions)) {
    throw new LoadedVibesError(
      'MODULE_UNSUPPORTED',
      `Packaged metadata for module "${expectedId}" is invalid.`,
    );
  }
  return {
    id: expectedId,
    contributions: value.contributions,
    replaces: Array.isArray(value.replaces) ? value.replaces : [],
    setup: Array.isArray(value.setup) ? value.setup : [],
  };
}

async function listFiles(
  directory: string,
  root = directory,
): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.loaded-vibes-module.json') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(absolute, root)));
    else files.push(path.relative(root, absolute));
  }
  return files;
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function assertAdditionIsSafe(plan: ModuleAdditionPlan): Promise<void> {
  for (const relative of plan.files) {
    const destination = path.join(plan.targetDirectory, relative);
    if (!(await exists(destination))) continue;
    if (!plan.replacements.includes(relative)) {
      throw new LoadedVibesError(
        'MODULE_CONFLICT',
        `Module "${plan.module}" would overwrite ${relative}. No files were changed.`,
      );
    }
    const baseline = path.join(plan.templateDirectory, relative);
    if (!(await exists(baseline))) {
      throw new LoadedVibesError(
        'MODULE_CONFLICT',
        `Module replacement baseline is missing for ${relative}. No files were changed.`,
      );
    }
    const [currentBody, baselineBody] = await Promise.all([
      readFile(destination),
      readFile(baseline),
    ]);
    if (!currentBody.equals(baselineBody)) {
      throw new LoadedVibesError(
        'MODULE_CONFLICT',
        `${relative} has changed since generation. Loaded Vibes will not overwrite it.`,
      );
    }
  }
}

export async function planProjectModuleAddition(
  targetDirectory: string,
  requestedModule: string,
): Promise<ModuleAdditionPlan> {
  const target = path.resolve(targetDirectory);
  const module = parseModuleId(requestedModule);
  const manifest = parseGenerationManifest(
    await readJson(path.join(target, '.loadedvibes', 'manifest.json')),
  );
  const currentRecipe = resolveRecipe(
    (await readJson(path.join(target, 'loadedvibes.json'))) as NormalizedRecipe,
  ).recipe;
  if (JSON.stringify(manifest.recipe) !== JSON.stringify(currentRecipe)) {
    throw new LoadedVibesError(
      'MODULE_CONFLICT',
      'loadedvibes.json and .loadedvibes/manifest.json disagree. Reconcile them before adding a module.',
    );
  }
  const capability = moduleCapabilities[module];
  if (isEnabled(currentRecipe, capability)) {
    throw new LoadedVibesError(
      'MODULE_ALREADY_PRESENT',
      `Module "${module}" is already present.`,
    );
  }
  const override: ModuleSelection =
    capability === 'sampleDomain'
      ? { sampleDomain: 'projects' }
      : { [capability]: true };
  const nextRecipe = resolveRecipe({
    ...currentRecipe,
    modules: { ...currentRecipe.modules, ...override },
  }).recipe;
  const addedCapabilities = (
    Object.keys(nextRecipe.modules) as CapabilityId[]
  ).filter((id) => !isEnabled(currentRecipe, id) && isEnabled(nextRecipe, id));
  const templateDirectory = await resolveTemplateDirectory();
  const sourceDirectory = path.resolve(
    templateDirectory,
    '..',
    'modules',
    module,
  );
  const metadata = await readModuleMetadata(sourceDirectory, module);
  const files = await listFiles(sourceDirectory);
  const plan: ModuleAdditionPlan = {
    targetDirectory: target,
    module,
    addedCapabilities,
    prerequisites: addedCapabilities.filter((id) => id !== capability),
    files,
    replacements: metadata.replaces,
    setup: metadata.setup,
    nextRecipe,
    manifest,
    sourceDirectory,
    templateDirectory,
  };
  await assertAdditionIsSafe(plan);
  return plan;
}

export async function applyProjectModuleAddition(
  plan: ModuleAdditionPlan,
): Promise<ModuleAdditionResult> {
  await assertAdditionIsSafe(plan);
  for (const relative of plan.files) {
    const destination = path.join(plan.targetDirectory, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(plan.sourceDirectory, relative), destination, {
      force: plan.replacements.includes(relative),
      errorOnExist: !plan.replacements.includes(relative),
    });
  }
  await writeRecipeArtifacts(plan.targetDirectory, plan.nextRecipe, {
    templateRevision: plan.manifest.template.revision,
    sourceRevision: plan.manifest.template.sourceRevision,
  });
  return {
    module: plan.module,
    addedCapabilities: plan.addedCapabilities,
    prerequisites: plan.prerequisites,
    filesAdded: plan.files.filter((file) => !plan.replacements.includes(file)),
    filesReplaced: plan.files.filter((file) =>
      plan.replacements.includes(file),
    ),
    setup: plan.setup,
  };
}
