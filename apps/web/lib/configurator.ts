import {
  defaultDesign,
  resolveRecipe,
  type CapabilityId,
  type Design,
  type ModuleSelection,
  type NormalizedRecipe,
  type ProductPresetId,
  type RecipeInput,
  type ResolvedRecipe,
} from '@loaded-vibes/core/browser';

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
      'A focused product built from the Loaded Vibes master template.',
  },
  design: defaultDesign,
};

export const configurableCapabilities = [
  'invitations',
  'billing',
  'stripeConnect',
  'onboarding',
  'admin',
  'marketing',
  'sampleDomain',
] as const satisfies readonly CapabilityId[];

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
  return JSON.stringify(resolveConfiguratorRecipe(recipe).recipe);
}

export function deserializeRecipe(value: string): ConfiguratorRecipe {
  const resolved = resolveRecipe(JSON.parse(value) as RecipeInput);
  return {
    ...resolved.recipe,
    modules: resolved.recipe.modules,
    identity: resolved.recipe.identity,
  };
}

export function createCliCommand(recipe: ConfiguratorRecipe): string {
  const normalized: NormalizedRecipe = resolveConfiguratorRecipe(recipe).recipe;
  return `pnpm dlx create-loaded-vibes@latest ${normalized.name} --config loadedvibes.json --yes`;
}
