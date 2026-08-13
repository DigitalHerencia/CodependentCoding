import {
  capabilityIds,
  capabilityRegistry,
  resolveApplicationDefinition,
  resolveRecipe,
  recipeFromApplicationResolution,
  type ApplicationDefinition,
  type ApplicationDefinitionInput,
  type CapabilityId,
  type ProductPresetId,
  type RecipeInput,
  type ResolvedRecipe,
} from '@hipster-stack/core/browser';

export type ConfiguratorRecipe = ApplicationDefinition;

export const defaultConfiguratorRecipe: ConfiguratorRecipe =
  resolveApplicationDefinition({
    schemaVersion: 1,
    preset: 'bare-golden-app',
    identity: {
      packageName: 'my-saas',
      displayName: 'My SaaS',
      description:
        'A focused product built from the Hipster Stack master template.',
    },
  }).resolved.definition;

export const configurableCapabilities = capabilityIds.filter(
  (id) => !capabilityRegistry[id].fixed,
) as CapabilityId[];

export type ConfigurableCapability = CapabilityId;

export function resolveConfiguratorRecipe(
  definition: ConfiguratorRecipe,
): ResolvedRecipe {
  const application = resolveApplicationDefinition(definition);
  const recipe = recipeFromApplicationResolution(application);
  const included = [...application.resolved.capabilities];
  return {
    recipe,
    application,
    summary: {
      preset: {
        id: definition.preset,
        label: definition.preset
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
  definition: ConfiguratorRecipe,
  capability: ConfigurableCapability,
  enabled: boolean,
): ConfiguratorRecipe {
  const include = definition.capabilities.include.filter(
    (candidate) => candidate !== capability,
  );
  const exclude = definition.capabilities.exclude.filter(
    (candidate) => candidate !== capability,
  );
  if (enabled) include.push(capability);
  else exclude.push(capability);

  if (capability === 'rbac' && !enabled) {
    for (const dependent of [
      'admin',
      'uploads',
      'ai',
      'maps',
      'sampleDomain',
      'stripeConnect',
    ] as const) {
      const includeIndex = include.indexOf(dependent);
      if (includeIndex >= 0) include.splice(includeIndex, 1);
      if (!exclude.includes(dependent)) exclude.push(dependent);
    }
  }

  const requiresRbac =
    enabled &&
    [
      'rbac',
      'admin',
      'uploads',
      'ai',
      'maps',
      'sampleDomain',
      'stripeConnect',
    ].includes(capability);
  return resolveApplicationDefinition({
    ...definition,
    capabilities: { include, exclude },
    authorization:
      capability === 'rbac' && !enabled
        ? { model: 'none' }
        : requiresRbac
          ? { model: 'rbac' }
          : { model: definition.authorization.model },
    routes: [],
    outputOverrides: { artifactSets: {}, artifacts: {} },
  }).resolved.definition;
}

export function setAuthenticationProvider(
  definition: ConfiguratorRecipe,
  provider: 'none' | 'clerk',
): ConfiguratorRecipe {
  const disabled: readonly CapabilityId[] = [
    'organizations',
    'invitations',
    'billing',
    'stripeConnect',
    'onboarding',
    'admin',
    'uploads',
    'ai',
    'maps',
    'sampleDomain',
  ];
  const include = definition.capabilities.include.filter(
    (capability) => provider !== 'none' || !disabled.includes(capability),
  );
  const exclude = [...definition.capabilities.exclude];
  if (provider === 'none') {
    for (const capability of disabled) {
      if (!exclude.includes(capability)) exclude.push(capability);
    }
  }
  return resolveApplicationDefinition({
    ...definition,
    providers: { ...definition.providers, authentication: provider },
    capabilities: { include, exclude },
    authorization: { model: definition.authorization.model },
    routes: [],
    outputOverrides: { artifactSets: {}, artifacts: {} },
  }).resolved.definition;
}

export function setPersistenceProvider(
  definition: ConfiguratorRecipe,
  technology: 'none' | 'postgresql',
): ConfiguratorRecipe {
  const disabled: readonly CapabilityId[] = [
    'organizations',
    'invitations',
    'rbac',
    'billing',
    'stripeConnect',
    'onboarding',
    'admin',
    'uploads',
    'ai',
    'maps',
    'sampleDomain',
  ];
  const include = definition.capabilities.include.filter(
    (capability) => technology !== 'none' || !disabled.includes(capability),
  );
  const exclude = [...definition.capabilities.exclude];
  if (technology === 'none') {
    for (const capability of disabled) {
      if (!exclude.includes(capability)) exclude.push(capability);
    }
  }
  return resolveApplicationDefinition({
    ...definition,
    capabilities: { include, exclude },
    authorization:
      technology === 'none'
        ? { model: 'none' }
        : { model: definition.authorization.model },
    providers: {
      ...definition.providers,
      persistence:
        technology === 'none'
          ? { technology: 'none', provider: 'none' }
          : { technology: 'postgresql', provider: 'neon' },
    },
    routes: [],
    outputOverrides: { artifactSets: {}, artifacts: {} },
  }).resolved.definition;
}

export function serializeRecipe(definition: ConfiguratorRecipe): string {
  return JSON.stringify({
    applicationDefinition:
      resolveApplicationDefinition(definition).resolved.definition,
  });
}

export function deserializeRecipe(value: string): ConfiguratorRecipe {
  const parsed = JSON.parse(value) as unknown;
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'applicationDefinition' in parsed
  ) {
    return resolveApplicationDefinition(
      (parsed as { applicationDefinition: ApplicationDefinitionInput })
        .applicationDefinition,
    ).resolved.definition;
  }
  const resolved = resolveRecipe(parsed as RecipeInput);
  return resolved.application.resolved.definition;
}

export function createCliCommand(definition: ConfiguratorRecipe): string {
  return `pnpm dlx hipster-stack@latest ${definition.identity.packageName} --config hipsterstack.json --yes`;
}

export function selectProductPreset(
  definition: ConfiguratorRecipe,
  preset: ProductPresetId,
): ConfiguratorRecipe {
  return resolveApplicationDefinition({
    ...definition,
    preset,
    providers: {},
    capabilities: { include: [], exclude: [] },
    authorization: { model: 'rbac' },
    routes: [],
    outputOverrides: { artifactSets: {}, artifacts: {} },
  }).resolved.definition;
}

export function createShareUrl(
  definition: ConfiguratorRecipe,
  currentUrl: string,
): string {
  const url = new URL(currentUrl);
  url.searchParams.set('recipe', serializeRecipe(definition));
  return url.toString();
}
