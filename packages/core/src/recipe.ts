import {
  capabilityIds,
  recipeSchema,
  type ApplicationDefinitionInput,
  type CapabilityId,
  type ModuleSelection,
  type NormalizedRecipe,
  type ParsedRecipe,
  type RecipeInput,
  type ResolvedModules,
} from '@hipster-stack/schema';
import { getProductPreset } from './presets.js';
import { capabilityRegistry } from './capabilities.js';
import {
  resolveApplicationDefinition,
  type ApplicationResolution,
} from './application-definition.js';
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
  application: ApplicationResolution;
}

export function resolveRecipe(input: RecipeInput): ResolvedRecipe {
  const parsed = recipeSchema.safeParse(input);
  if (!parsed.success) {
    throw new LoadedVibesError('INVALID_CONFIG', parsed.error.message);
  }
  const preset = getProductPreset(parsed.data.product);
  const applicationResolution = resolveApplicationDefinition(
    applicationDefinitionFromRecipe(parsed.data),
  );
  const included = [...applicationResolution.resolved.capabilities];
  const excluded = capabilityIds.filter((id) => !included.includes(id));
  const recipe = recipeFromApplicationResolution(applicationResolution);
  return {
    recipe,
    summary: {
      preset: { id: preset.id, label: preset.label },
      included: included.map((id) => capabilityRegistry[id].label),
      excluded: excluded.map((id) => capabilityRegistry[id].label),
      autoIncluded: applicationResolution.resolved.autoIncluded.map(
        (id) => capabilityRegistry[id].label,
      ),
    },
    application: applicationResolution,
  };
}

export function normalizeRecipe(input: RecipeInput): NormalizedRecipe {
  return resolveRecipe(input).recipe;
}

export function applicationDefinitionFromRecipe(
  recipe: ParsedRecipe,
): ApplicationDefinitionInput {
  const include: CapabilityId[] = [];
  const exclude: CapabilityId[] = [];
  for (const [id, value] of Object.entries(recipe.modules) as [
    CapabilityId,
    ModuleSelection[CapabilityId],
  ][]) {
    if (value === undefined) continue;
    if (value === false) exclude.push(id);
    else include.push(id);
  }
  return {
    schemaVersion: 1,
    preset: recipe.product,
    identity: {
      packageName: recipe.name,
      ...(recipe.identity.displayName
        ? { displayName: recipe.identity.displayName }
        : {}),
      description: recipe.identity.description,
    },
    capabilities: { include, exclude },
    authorization: {
      model: recipe.modules.rbac === false ? 'none' : 'rbac',
    },
    presentation: recipe.design,
    outputOverrides: { artifactSets: {}, artifacts: {} },
  };
}

export function recipeFromApplicationDefinition(
  input: ApplicationDefinitionInput,
): NormalizedRecipe {
  return recipeFromApplicationResolution(resolveApplicationDefinition(input));
}

export function recipeFromApplicationResolution(
  application: ApplicationResolution,
): NormalizedRecipe {
  const definition = application.resolved.definition;
  return {
    schemaVersion: 1,
    name: definition.identity.packageName,
    product: definition.preset,
    modules: modulesFromCapabilities(application.resolved.capabilities),
    identity: {
      displayName: definition.identity.displayName,
      description: definition.identity.description,
    },
    design: definition.presentation,
  };
}

function modulesFromCapabilities(
  capabilities: readonly CapabilityId[],
): ResolvedModules {
  const selected = new Set(capabilities);
  return {
    organizations: selected.has('organizations'),
    invitations: selected.has('invitations'),
    rbac: selected.has('rbac'),
    billing: selected.has('billing'),
    stripeConnect: selected.has('stripeConnect'),
    onboarding: selected.has('onboarding'),
    admin: selected.has('admin'),
    uploads: selected.has('uploads'),
    ai: selected.has('ai'),
    maps: selected.has('maps'),
    marketing: selected.has('marketing'),
    sampleDomain: selected.has('sampleDomain') ? 'projects' : false,
    governance: selected.has('governance'),
  };
}
