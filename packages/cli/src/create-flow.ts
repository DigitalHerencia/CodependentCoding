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
  getProductPreset,
  productPresetIds,
  resolveRecipe,
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
      options: choices(['obsidian', 'paper', 'electric'] as const, title),
    }) as Promise<PromptResult<Design['theme']>>,
  radius: (initial) =>
    select({
      message: 'Corner style',
      initialValue: initial,
      options: choices(['compact', 'medium', 'rounded'] as const, title),
    }) as Promise<PromptResult<Design['radius']>>,
  density: (initial) =>
    select({
      message: 'Interface density',
      initialValue: initial,
      options: choices(['compact', 'comfortable'] as const, title),
    }) as Promise<PromptResult<Design['density']>>,
  navigation: (initial) =>
    select({
      message: 'Navigation shell',
      initialValue: initial,
      options: choices(['sidebar', 'topbar'] as const, title),
    }) as Promise<PromptResult<Design['navigation']>>,
  colorMode: (initial) =>
    select({
      message: 'Color mode',
      initialValue: initial,
      options: choices(['light', 'dark', 'system'] as const, title),
    }) as Promise<PromptResult<Design['mode']>>,
  review: (body) => note(body, 'Build review'),
  approve: () =>
    confirm({ message: 'Generate this output?', initialValue: true }),
};

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
