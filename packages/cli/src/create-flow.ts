import {
  confirm,
  isCancel,
  multiselect,
  note,
  select,
  text,
} from '@clack/prompts';
import {
  capabilityRegistry,
  capabilityIds,
  applicationProperties,
  designChoices,
  getProductPreset,
  productPresetIds,
  resolveApplicationDefinition,
  resolveRecipe,
  type ApplicationDefinitionInput,
  type ApplicationResolution,
  type CapabilityId,
  type Design,
  type ProductPresetId,
  type RecipeInput,
  type ResolvedRecipe,
} from '@hipster-stack/core';

export type SetupMode = 'express' | 'advanced';
type PromptResult<T> = T | symbol;

const optionalCapabilities = capabilityIds.filter(
  (id) => !capabilityRegistry[id].fixed,
);

export interface CreateFlowPrompts {
  mode(): Promise<PromptResult<SetupMode>>;
  product(): Promise<PromptResult<ProductPresetId>>;
  capabilities(initial: CapabilityId[]): Promise<PromptResult<CapabilityId[]>>;
  authentication?(
    initial: 'none' | 'clerk',
  ): Promise<PromptResult<'none' | 'clerk'>>;
  persistence?(
    initial: 'none' | 'postgresql',
  ): Promise<PromptResult<'none' | 'postgresql'>>;
  authorization?(
    initial: 'none' | 'rbac',
  ): Promise<PromptResult<'none' | 'rbac'>>;
  displayName(initial: string): Promise<PromptResult<string>>;
  description(initial: string): Promise<PromptResult<string>>;
  theme(initial: Design['theme']): Promise<PromptResult<Design['theme']>>;
  radius(initial: Design['radius']): Promise<PromptResult<Design['radius']>>;
  density(initial: Design['density']): Promise<PromptResult<Design['density']>>;
  navigation(
    initial: Design['navigation'],
  ): Promise<PromptResult<Design['navigation']>>;
  colorMode(initial: Design['mode']): Promise<PromptResult<Design['mode']>>;
  review(body: string): void;
  approve(): Promise<PromptResult<boolean>>;
}

function choices<T extends string>(
  values: readonly T[],
  label: (value: T) => string,
) {
  return values.map((value) => ({ value, label: label(value) }));
}

export const clackCreateFlowPrompts: CreateFlowPrompts = {
  mode: () =>
    select({
      message: 'How would you like to configure your product?',
      options: [
        {
          value: 'express',
          label: 'Express',
          hint: 'a starting configuration and product identity',
        },
        {
          value: 'advanced',
          label: 'Advanced',
          hint: 'all supported surfaces, identity, and visual choices',
        },
      ],
    }) as Promise<PromptResult<SetupMode>>,
  product: () =>
    select({
      message: 'Choose a starting configuration',
      options: choices(productPresetIds, (id) => getProductPreset(id).label),
    }) as Promise<PromptResult<ProductPresetId>>,
  capabilities: (initial) =>
    multiselect({
      message: 'Which optional surfaces should be included?',
      options: choices(
        optionalCapabilities,
        (id) => capabilityRegistry[id].label,
      ),
      initialValues: initial,
      required: false,
    }) as Promise<PromptResult<CapabilityId[]>>,
  authentication: (initial) =>
    select({
      message: 'Authentication provider',
      initialValue: initial,
      options: choices(
        propertyValues('providers.authentication', ['none', 'clerk']),
        title,
      ),
    }) as Promise<PromptResult<'none' | 'clerk'>>,
  persistence: (initial) =>
    select({
      message: 'Persistence',
      initialValue: initial,
      options: choices(
        propertyValues('providers.persistence.technology', [
          'none',
          'postgresql',
        ]),
        title,
      ),
    }) as Promise<PromptResult<'none' | 'postgresql'>>,
  authorization: (initial) =>
    select({
      message: 'Authorization model',
      initialValue: initial,
      options: choices(
        propertyValues('authorizationModel', ['none', 'rbac']),
        (value) => value.toUpperCase(),
      ),
    }) as Promise<PromptResult<'none' | 'rbac'>>,
  displayName: (initial) =>
    text({ message: 'Product name', initialValue: initial }),
  description: (initial) =>
    text({
      message: 'Short product description',
      initialValue: initial,
      placeholder: 'What this product helps customers do',
    }),
  theme: (initial) =>
    select({
      message: 'Visual direction',
      initialValue: initial,
      options: choices(designChoices.theme, title),
    }) as Promise<PromptResult<Design['theme']>>,
  radius: (initial) =>
    select({
      message: 'Corner style',
      initialValue: initial,
      options: choices(designChoices.radius, title),
    }) as Promise<PromptResult<Design['radius']>>,
  density: (initial) =>
    select({
      message: 'Interface density',
      initialValue: initial,
      options: choices(designChoices.density, title),
    }) as Promise<PromptResult<Design['density']>>,
  navigation: (initial) =>
    select({
      message: 'Navigation shell',
      initialValue: initial,
      options: choices(designChoices.navigation, title),
    }) as Promise<PromptResult<Design['navigation']>>,
  colorMode: (initial) =>
    select({
      message: 'Color mode',
      initialValue: initial,
      options: choices(designChoices.mode, title),
    }) as Promise<PromptResult<Design['mode']>>,
  review: (body) => note(body, 'Build review'),
  approve: () =>
    confirm({ message: 'Generate this output?', initialValue: true }),
};

function propertyValues<T extends string>(
  id: string,
  fallback: readonly T[],
): readonly T[] {
  return (
    (applicationProperties.find((property) => property.id === id)
      ?.allowedValues as readonly T[] | undefined) ?? fallback
  );
}

function title(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function cancelled<T>(value: PromptResult<T>): value is symbol {
  return isCancel(value);
}

export async function collectInteractiveRecipe(
  base: RecipeInput,
  prompts: CreateFlowPrompts = clackCreateFlowPrompts,
): Promise<RecipeInput | null> {
  const mode = await prompts.mode();
  if (cancelled(mode)) return null;
  const product = await prompts.product();
  if (cancelled(product)) return null;
  const current = resolveRecipe({ ...base, product }).recipe;
  const displayName = await prompts.displayName(current.identity.displayName);
  if (cancelled(displayName)) return null;

  let recipe: RecipeInput = {
    ...base,
    product,
    identity: { ...current.identity, displayName },
  };
  if (mode === 'advanced') {
    const initial = optionalCapabilities.filter((id) =>
      id === 'sampleDomain'
        ? current.modules.sampleDomain !== false
        : current.modules[id],
    );
    const selected = await prompts.capabilities([...initial]);
    if (cancelled(selected)) return null;
    const selectedSet = new Set(selected);
    const description = await prompts.description(current.identity.description);
    if (cancelled(description)) return null;
    const theme = await prompts.theme(current.design.theme);
    if (cancelled(theme)) return null;
    const radius = await prompts.radius(current.design.radius);
    if (cancelled(radius)) return null;
    const density = await prompts.density(current.design.density);
    if (cancelled(density)) return null;
    const navigation = await prompts.navigation(current.design.navigation);
    if (cancelled(navigation)) return null;
    const colorMode = await prompts.colorMode(current.design.mode);
    if (cancelled(colorMode)) return null;
    recipe = {
      ...recipe,
      modules: {
        invitations: selectedSet.has('invitations'),
        billing: selectedSet.has('billing'),
        stripeConnect: selectedSet.has('stripeConnect'),
        onboarding: selectedSet.has('onboarding'),
        admin: selectedSet.has('admin'),
        marketing: selectedSet.has('marketing'),
        sampleDomain: selectedSet.has('sampleDomain') ? 'projects' : false,
      },
      identity: { displayName, description },
      design: { theme, radius, density, navigation, mode: colorMode },
    };
  }
  return recipe;
}

export async function collectInteractiveApplicationDefinition(
  base: ApplicationDefinitionInput,
  prompts: CreateFlowPrompts = clackCreateFlowPrompts,
): Promise<ApplicationDefinitionInput | null> {
  const mode = await prompts.mode();
  if (cancelled(mode)) return null;
  const product = await prompts.product();
  if (cancelled(product)) return null;
  const current = resolveApplicationDefinition({ ...base, preset: product });
  const displayName = await prompts.displayName(
    current.resolved.definition.identity.displayName,
  );
  if (cancelled(displayName)) return null;
  if (mode === 'express') {
    return {
      ...base,
      preset: product,
      identity: {
        ...current.resolved.definition.identity,
        displayName,
      },
    };
  }

  const selected = await prompts.capabilities(
    optionalCapabilities.filter((id) =>
      current.resolved.capabilities.includes(id),
    ),
  );
  if (cancelled(selected)) return null;
  const authentication = prompts.authentication
    ? await prompts.authentication(
        current.resolved.providers.some((provider) => provider.id === 'clerk')
          ? 'clerk'
          : 'none',
      )
    : undefined;
  if (authentication !== undefined && cancelled(authentication)) return null;
  const persistence = prompts.persistence
    ? await prompts.persistence(
        current.resolved.providers.some((provider) => provider.id === 'neon')
          ? 'postgresql'
          : 'none',
      )
    : undefined;
  if (persistence !== undefined && cancelled(persistence)) return null;
  const authorization = prompts.authorization
    ? await prompts.authorization(current.resolved.authorization.model)
    : undefined;
  if (authorization !== undefined && cancelled(authorization)) return null;
  const description = await prompts.description(
    current.resolved.definition.identity.description,
  );
  if (cancelled(description)) return null;
  const theme = await prompts.theme(
    current.resolved.definition.presentation.theme,
  );
  if (cancelled(theme)) return null;
  const radius = await prompts.radius(
    current.resolved.definition.presentation.radius,
  );
  if (cancelled(radius)) return null;
  const density = await prompts.density(
    current.resolved.definition.presentation.density,
  );
  if (cancelled(density)) return null;
  const navigation = await prompts.navigation(
    current.resolved.definition.presentation.navigation,
  );
  if (cancelled(navigation)) return null;
  const colorMode = await prompts.colorMode(
    current.resolved.definition.presentation.mode,
  );
  if (cancelled(colorMode)) return null;
  const selectedSet = new Set(selected);
  return {
    schemaVersion: 1,
    preset: product,
    identity: {
      packageName: current.resolved.definition.identity.packageName,
      displayName,
      description,
    },
    providers: {
      ...(authentication !== undefined ? { authentication } : {}),
      ...(persistence !== undefined
        ? {
            persistence:
              persistence === 'none'
                ? { technology: 'none' as const, provider: 'none' as const }
                : {
                    technology: 'postgresql' as const,
                    provider: 'neon' as const,
                  },
          }
        : {}),
    },
    capabilities: {
      include: optionalCapabilities.filter((id) => selectedSet.has(id)),
      exclude: optionalCapabilities.filter((id) => !selectedSet.has(id)),
    },
    authorization: {
      model: authorization ?? current.resolved.authorization.model,
    },
    routes: [],
    presentation: {
      theme,
      radius,
      density,
      navigation,
      mode: colorMode,
    },
    outputOverrides: { artifactSets: {}, artifacts: {} },
  };
}

export function formatApplicationReview(
  application: ApplicationResolution,
): string {
  const resolved = application.resolved;
  return [
    resolved.definition.identity.displayName,
    '',
    `Starting configuration: ${getProductPreset(resolved.definition.preset).label}`,
    `Providers: ${resolved.providers.map((provider) => provider.label).join(', ') || 'None'}`,
    `Authorization: ${resolved.authorization.model.toUpperCase()}`,
    `Capabilities: ${resolved.capabilities.map((id) => capabilityRegistry[id].label).join(', ') || 'None'}`,
    `Resolved output: ${resolved.routes.length} routes, ${resolved.artifactSets.length} artifact sets, ${application.plan.filesRetained.length} files`,
    `Setup: ${resolved.setup.length} steps, ${resolved.environment.length} environment requirements`,
  ].join('\n');
}

export async function reviewApplicationDefinition(
  definition: ApplicationDefinitionInput,
  prompts: CreateFlowPrompts = clackCreateFlowPrompts,
): Promise<boolean> {
  prompts.review(
    formatApplicationReview(resolveApplicationDefinition(definition)),
  );
  const approval = await prompts.approve();
  return !cancelled(approval) && approval;
}

export function formatRecipeReview(resolved: ResolvedRecipe): string {
  const { recipe, summary } = resolved;
  const application = resolved.application.resolved;
  return [
    `${recipe.identity.displayName}`,
    '',
    `Starting configuration: ${summary.preset.label}`,
    `Providers: ${application.providers.map((provider) => provider.label).join(', ') || 'None'}`,
    `Authorization: ${application.authorization.model.toUpperCase()}`,
    `Optional surfaces: ${summary.included.filter((item) => !['Organizations', 'Local roles and authorization', 'Generated project guidance'].includes(item)).join(', ') || 'None'}`,
    `Excluded surfaces: ${summary.excluded.join(', ') || 'None'}`,
    `Visual direction: ${title(recipe.design.theme)}, ${title(recipe.design.navigation)}, ${title(recipe.design.density)}, ${title(recipe.design.mode)}`,
    `Resolved output: ${application.routes.length} routes, ${application.artifactSets.length} artifact sets, ${application.environment.length} environment requirements`,
  ].join('\n');
}

export async function reviewRecipe(
  recipe: RecipeInput,
  prompts: CreateFlowPrompts = clackCreateFlowPrompts,
): Promise<boolean> {
  prompts.review(formatRecipeReview(resolveRecipe(recipe)));
  const approval = await prompts.approve();
  return !cancelled(approval) && approval;
}
