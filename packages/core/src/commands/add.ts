import { access, cp, mkdir, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import type {
  CapabilityId,
  ModuleSelection,
  NormalizedRecipe,
} from '@hipster-stack/schema';
import { LoadedVibesError } from '../errors.js';
import {
  generatedModuleIds,
  getAddableOwnership,
  type GeneratedModuleId,
} from '../ownership.js';
import type { GenerationManifest } from '../manifest.js';
import { resolveRecipe } from '../recipe.js';
import { loadGeneratedProject } from '../project.js';
import { writeRecipeArtifacts } from '../generator/transforms.js';
import { resolveTemplateDirectory } from './create.js';

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

async function listContributionFiles(
  templateDirectory: string,
  contributions: readonly string[],
): Promise<string[]> {
  const files = await Promise.all(
    contributions.map(async (contribution) => {
      const source = path.join(templateDirectory, contribution);
      const entry = await stat(source);
      return entry.isDirectory()
        ? listFiles(source, templateDirectory)
        : [contribution];
    }),
  );
  return files.flat();
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function canonicalProjectionFiles(
  files: readonly string[],
  targetDirectory: string,
  templateDirectory: string,
): Promise<string[]> {
  const projections: string[] = [];
  for (const relative of files) {
    const target = path.join(targetDirectory, relative);
    const canonical = path.join(templateDirectory, relative);
    if (!(await exists(target)) || !(await exists(canonical))) continue;
    const [targetBody, canonicalBody] = await Promise.all([
      readFile(target),
      readFile(canonical),
    ]);
    if (targetBody.equals(canonicalBody)) projections.push(relative);
  }
  return projections;
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
        `${relative} has changed since generation. Hipster Stack will not overwrite it.`,
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
  const { manifest, recipe: currentRecipe } =
    await loadGeneratedProject(target);
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
  const ownership = getAddableOwnership(module);
  const sourceDirectory = templateDirectory;
  const files = await listContributionFiles(
    templateDirectory,
    ownership.add.paths,
  );
  const projectionFiles = await canonicalProjectionFiles(
    files,
    target,
    templateDirectory,
  );
  const plan: ModuleAdditionPlan = {
    targetDirectory: target,
    module,
    addedCapabilities,
    prerequisites: addedCapabilities.filter((id) => id !== capability),
    files,
    replacements: [
      ...new Set([...ownership.add.replacements, ...projectionFiles]),
    ],
    setup: [...ownership.add.setup],
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
  await writeRecipeArtifacts(
    plan.targetDirectory,
    plan.nextRecipe,
    {
      templateId: plan.manifest.template.id,
      templateVersion: plan.manifest.template.version,
    },
    resolveRecipe(plan.nextRecipe).application.resolved.definition,
  );
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
