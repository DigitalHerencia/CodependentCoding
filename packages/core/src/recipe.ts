import validatePackageName from 'validate-npm-package-name';
import {
  capabilityIds,
  recipeSchema,
  type NormalizedRecipe,
  type RecipeInput,
} from '@hipster-stack/schema';
import { getProductPreset } from './presets.js';
import {
  capabilityRegistry,
  resolveCapabilitySelection,
} from './capabilities.js';
import { LoadedVibesError } from './errors.js';

export interface ResolvedBuildSummary {
  preset: { id: NormalizedRecipe['product']; label: string };
  included: string[];
  excluded: string[];
  autoIncluded: string[];
}

export interface ResolvedRecipe {
  recipe: NormalizedRecipe;
  summary: ResolvedBuildSummary;
}

export function resolveRecipe(input: RecipeInput): ResolvedRecipe {
  const parsed = recipeSchema.safeParse(input);
  if (!parsed.success) {
    throw new LoadedVibesError('INVALID_CONFIG', parsed.error.message);
  }

  const packageName = validatePackageName(parsed.data.name);
  if (!packageName.validForNewPackages) {
    throw new LoadedVibesError(
      'INVALID_PROJECT_NAME',
      `Invalid project name "${parsed.data.name}": ${[
        ...(packageName.errors ?? []),
        ...(packageName.warnings ?? []),
      ].join('; ')}`,
    );
  }

  const preset = getProductPreset(parsed.data.product);
  const resolution = resolveCapabilitySelection(
    preset.modules,
    parsed.data.modules,
  );
  const included = capabilityIds.filter((id) =>
    id === 'sampleDomain'
      ? resolution.modules.sampleDomain !== false
      : resolution.modules[id],
  );
  const excluded = capabilityIds.filter((id) => !included.includes(id));
  return {
    recipe: {
      schemaVersion: parsed.data.schemaVersion,
      name: parsed.data.name,
      product: parsed.data.product,
      modules: resolution.modules,
      identity: {
        displayName: parsed.data.identity.displayName ?? parsed.data.name,
        description: parsed.data.identity.description,
      },
      design: parsed.data.design,
    },
    summary: {
      preset: { id: preset.id, label: preset.label },
      included: included.map((id) => capabilityRegistry[id].label),
      excluded: excluded.map((id) => capabilityRegistry[id].label),
      autoIncluded: resolution.autoIncluded.map(
        (id) => capabilityRegistry[id].label,
      ),
    },
  };
}

export function normalizeRecipe(input: RecipeInput): NormalizedRecipe {
  return resolveRecipe(input).recipe;
}
