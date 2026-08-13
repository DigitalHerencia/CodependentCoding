import {
  defaultDesign,
  capabilityIds,
  capabilityRegistry,
  resolveApplicationDefinition,
  resolveRecipe,
  type CapabilityId,
  type ApplicationDefinitionInput,
  type Design,
  type ModuleSelection,
  type NormalizedRecipe,
  type ProductPresetId,
  type RecipeInput,
  type ResolvedRecipe,
} from '@hipster-stack/core/browser';

export interface ConfiguratorRecipe {
  schemaVersion: 1;
  name: string;
  product: ProductPresetId;
  modules: ModuleSelection;
  identity: {
    displayName: string;
    description: string;
  };
  design: Design;
}

export const defaultConfiguratorRecipe: ConfiguratorRecipe = {
  schemaVersion: 1,
  name: 'my-saas',
  product: 'bare-golden-app',
  modules: {},
  identity: {
    displayName: 'My SaaS',
    description:
      'A focused product built from the Hipster Stack master template.',
  },
  design: defaultDesign,
};

export const configurableCapabilities = capabilityIds.filter(
  (id) => !capabilityRegistry[id].fixed,
) as CapabilityId[];

export type ConfigurableCapability = CapabilityId;

export function resolveConfiguratorRecipe(
  draft: ConfiguratorRecipe,
): ResolvedRecipe {
  const name = draft.name.trim() || defaultConfiguratorRecipe.name;
  return resolveRecipe({
    ...draft,
    name,
    identity: {
      displayName: draft.identity.displayName.trim() || name,
      description: draft.identity.description.trim(),
    },
  });
}

export function setCapability(
  draft: ConfiguratorRecipe,
  capability: (typeof configurableCapabilities)[number],
  enabled: boolean,
): ConfiguratorRecipe {
  return {
    ...draft,
    modules: {
      ...draft.modules,
      [capability]:
        capability === 'sampleDomain'
          ? enabled
            ? 'projects'
            : false
          : enabled,
    },
  };
}

export function serializeRecipe(recipe: ConfiguratorRecipe): string {
  return JSON.stringify({
    applicationDefinition:
      resolveConfiguratorRecipe(recipe).application.resolved.definition,
  });
}

export function deserializeRecipe(value: string): ConfiguratorRecipe {
  const parsed = JSON.parse(value) as unknown;
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'applicationDefinition' in parsed
  ) {
    const application = resolveApplicationDefinition(
      (parsed as { applicationDefinition: ApplicationDefinitionInput })
        .applicationDefinition,
    ).resolved.definition;
    const modules: ModuleSelection = {};
    for (const id of application.capabilities.include) {
      if (id === 'sampleDomain') modules.sampleDomain = 'projects';
      else modules[id] = true;
    }
    for (const id of application.capabilities.exclude) modules[id] = false;
    return {
      schemaVersion: 1,
      name: application.identity.packageName,
      product: application.preset,
      modules,
      identity: {
        displayName: application.identity.displayName,
        description: application.identity.description,
      },
      design: application.presentation,
    };
  }
  const resolved = resolveRecipe(parsed as RecipeInput);
  return {
    ...resolved.recipe,
    modules: resolved.recipe.modules,
    identity: resolved.recipe.identity,
  };
}

export function createCliCommand(recipe: ConfiguratorRecipe): string {
  const normalized: NormalizedRecipe = resolveConfiguratorRecipe(recipe).recipe;
  return `pnpm dlx hipster-stack@latest ${normalized.name} --config hipsterstack.json --yes`;
}

export function selectProductPreset(
  recipe: ConfiguratorRecipe,
  product: ProductPresetId,
): ConfiguratorRecipe {
  return { ...recipe, product, modules: {} };
}

export function createShareUrl(
  recipe: ConfiguratorRecipe,
  currentUrl: string,
): string {
  const url = new URL(currentUrl);
  url.searchParams.set('recipe', serializeRecipe(recipe));
  return url.toString();
}
