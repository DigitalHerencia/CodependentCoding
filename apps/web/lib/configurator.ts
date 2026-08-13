import {
  defaultDesign,
  capabilityIds,
  capabilityRegistry,
  resolveApplicationDefinition,
  recipeFromApplicationResolution,
  resolveRecipe,
  type CapabilityId,
  type ApplicationDefinitionInput,
  type Design,
  type ProviderSelection,
  type RoleDefinition,
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
  providers: ProviderSelection;
  authorization: {
    model: 'rbac' | 'none';
    roles?: RoleDefinition[];
  };
  outputOverrides: ApplicationDefinitionInput['outputOverrides'];
  routes: NonNullable<ApplicationDefinitionInput['routes']>;
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
  providers: {},
  authorization: { model: 'rbac' },
  outputOverrides: { artifactSets: {}, artifacts: {} },
  routes: [],
};

export const configurableCapabilities = capabilityIds.filter(
  (id) => !capabilityRegistry[id].fixed,
) as CapabilityId[];

export type ConfigurableCapability = CapabilityId;

export function resolveConfiguratorRecipe(
  draft: ConfiguratorRecipe,
): ResolvedRecipe {
  const name = draft.name.trim() || defaultConfiguratorRecipe.name;
  const include: CapabilityId[] = [];
  const exclude: CapabilityId[] = [];
  for (const [id, value] of Object.entries(draft.modules) as [
    CapabilityId,
    ModuleSelection[CapabilityId],
  ][]) {
    if (value === undefined) continue;
    if (value === false) exclude.push(id);
    else include.push(id);
  }
  const application = resolveApplicationDefinition({
    schemaVersion: 1,
    preset: draft.product,
    identity: {
      packageName: name,
      displayName: draft.identity.displayName.trim() || name,
      description: draft.identity.description.trim(),
    },
    providers: draft.providers,
    capabilities: { include, exclude },
    authorization: draft.authorization,
    routes: draft.routes,
    presentation: draft.design,
    outputOverrides: draft.outputOverrides,
  });
  const recipe = recipeFromApplicationResolution(application);
  const included = [...application.resolved.capabilities];
  return {
    recipe,
    application,
    summary: {
      preset: {
        id: draft.product,
        label: draft.product
          .split('-')
          .map((word) => word[0]?.toUpperCase() + word.slice(1))
          .join(' '),
      },
      included: included.map((id) => capabilityRegistry[id].label),
      excluded: capabilityIds
        .filter((id) => !included.includes(id))
        .map((id) => capabilityRegistry[id].label),
      autoIncluded: application.resolved.autoIncluded.map(
        (id) => capabilityRegistry[id].label,
      ),
    },
  };
}

export function setCapability(
  draft: ConfiguratorRecipe,
  capability: (typeof configurableCapabilities)[number],
  enabled: boolean,
): ConfiguratorRecipe {
  const requiresPersistence = [
    'organizations',
    'invitations',
    'rbac',
    'billing',
    'stripeConnect',
    'onboarding',
    'admin',
    'sampleDomain',
  ].includes(capability);
  const requiresAuthentication = [
    'organizations',
    'invitations',
    'billing',
    'stripeConnect',
    'onboarding',
    'sampleDomain',
  ].includes(capability);
  const modules = {
    ...draft.modules,
    [capability]:
      capability === 'sampleDomain'
        ? enabled
          ? ('projects' as const)
          : false
        : enabled,
  };
  if (capability === 'rbac' && !enabled) {
    modules.admin = false;
    modules.sampleDomain = false;
    modules.stripeConnect = false;
  }
  const providers = { ...draft.providers };
  if (enabled && requiresAuthentication) providers.authentication = 'clerk';
  if (enabled && requiresPersistence) {
    providers.persistence = {
      technology: 'postgresql',
      provider: 'neon',
    };
  }
  if (enabled && ['billing', 'stripeConnect'].includes(capability)) {
    delete providers.commerce;
  }
  return {
    ...draft,
    routes: [],
    outputOverrides: { artifactSets: {}, artifacts: {} },
    providers,
    authorization:
      capability === 'rbac' && !enabled
        ? { model: 'none' }
        : enabled &&
            ['rbac', 'admin', 'sampleDomain', 'stripeConnect'].includes(
              capability,
            )
          ? { model: 'rbac' }
          : { model: draft.authorization.model },
    modules,
  };
}

export function setAuthenticationProvider(
  draft: ConfiguratorRecipe,
  provider: 'none' | 'clerk',
): ConfiguratorRecipe {
  const modules = { ...draft.modules };
  if (provider === 'none') {
    for (const id of [
      'organizations',
      'invitations',
      'billing',
      'stripeConnect',
      'onboarding',
      'admin',
      'sampleDomain',
    ] as const)
      modules[id] = false;
  }
  return {
    ...draft,
    routes: [],
    outputOverrides: { artifactSets: {}, artifacts: {} },
    modules,
    authorization: { model: draft.authorization.model },
    providers: { ...draft.providers, authentication: provider },
  };
}

export function setPersistenceProvider(
  draft: ConfiguratorRecipe,
  technology: 'none' | 'postgresql',
): ConfiguratorRecipe {
  const modules = { ...draft.modules };
  if (technology === 'none') {
    for (const id of [
      'organizations',
      'invitations',
      'rbac',
      'billing',
      'stripeConnect',
      'onboarding',
      'admin',
      'sampleDomain',
    ] as const)
      modules[id] = false;
  }
  return {
    ...draft,
    routes: [],
    outputOverrides: { artifactSets: {}, artifacts: {} },
    modules,
    authorization:
      technology === 'none' ? { model: 'none' } : draft.authorization,
    providers: {
      ...draft.providers,
      persistence:
        technology === 'none'
          ? { technology: 'none', provider: 'none' }
          : { technology: 'postgresql', provider: 'neon' },
      ...(technology === 'none' ? { commerce: 'none' as const } : {}),
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
      providers: application.providers,
      authorization: application.authorization,
      outputOverrides: application.outputOverrides,
      routes: application.routes,
    };
  }
  const resolved = resolveRecipe(parsed as RecipeInput);
  return {
    ...resolved.recipe,
    modules: resolved.recipe.modules,
    identity: resolved.recipe.identity,
    providers: resolved.application.resolved.definition.providers,
    authorization: resolved.application.resolved.definition.authorization,
    outputOverrides: resolved.application.resolved.definition.outputOverrides,
    routes: resolved.application.resolved.definition.routes,
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
  return {
    ...recipe,
    product,
    modules: {},
    providers: {},
    authorization: { model: 'rbac' },
    routes: [],
  };
}

export function createShareUrl(
  recipe: ConfiguratorRecipe,
  currentUrl: string,
): string {
  const url = new URL(currentUrl);
  url.searchParams.set('recipe', serializeRecipe(recipe));
  return url.toString();
}
