import { z } from 'zod';

export const recipeSchemaVersion = 1 as const;

export const productPresetIds = [
  'b2b-saas',
  'client-portal',
  'platform-marketplace',
  'bare-golden-app',
] as const;

export const productPresetSchema = z.enum(productPresetIds);

export const capabilityIds = [
  'organizations',
  'invitations',
  'rbac',
  'billing',
  'stripeConnect',
  'onboarding',
  'admin',
  'marketing',
  'sampleDomain',
  'governance',
] as const;

export const moduleSelectionSchema = z
  .object({
    organizations: z.boolean().optional(),
    invitations: z.boolean().optional(),
    rbac: z.boolean().optional(),
    billing: z.boolean().optional(),
    stripeConnect: z.boolean().optional(),
    onboarding: z.boolean().optional(),
    admin: z.boolean().optional(),
    marketing: z.boolean().optional(),
    sampleDomain: z.union([z.literal(false), z.literal('projects')]).optional(),
    governance: z.boolean().optional(),
  })
  .strict();

export const resolvedModulesSchema = z.object({
  organizations: z.boolean(),
  invitations: z.boolean(),
  rbac: z.boolean(),
  billing: z.boolean(),
  stripeConnect: z.boolean(),
  onboarding: z.boolean(),
  admin: z.boolean(),
  marketing: z.boolean(),
  sampleDomain: z.union([z.literal(false), z.literal('projects')]),
  governance: z.boolean(),
});

export const productIdentitySchema = z
  .object({
    displayName: z.string().trim().min(1).optional(),
    description: z.string().trim().max(160).default(''),
  })
  .strict();

export const designSchema = z
  .object({
    theme: z.enum(['obsidian', 'paper', 'electric']).default('obsidian'),
    radius: z.enum(['compact', 'medium', 'rounded']).default('medium'),
    density: z.enum(['compact', 'comfortable']).default('comfortable'),
    navigation: z.enum(['sidebar', 'topbar']).default('sidebar'),
    mode: z.enum(['light', 'dark', 'system']).default('system'),
  })
  .strict();

export const defaultDesign = {
  theme: 'obsidian',
  radius: 'medium',
  density: 'comfortable',
  navigation: 'sidebar',
  mode: 'system',
} as const;

export const recipeSchema = z
  .object({
    schemaVersion: z.literal(recipeSchemaVersion).default(recipeSchemaVersion),
    name: z.string().trim().min(1, 'Recipe name is required.'),
    product: productPresetSchema.default('bare-golden-app'),
    modules: moduleSelectionSchema.default({}),
    identity: productIdentitySchema.default({ description: '' }),
    design: designSchema.default(defaultDesign),
  })
  .strict();

export const normalizedRecipeSchema = recipeSchema.extend({
  modules: resolvedModulesSchema,
  identity: productIdentitySchema.extend({
    displayName: z.string().trim().min(1),
  }),
});

export type RecipeInput = z.input<typeof recipeSchema>;
export type ParsedRecipe = z.output<typeof recipeSchema>;
export type ProductPresetId = z.infer<typeof productPresetSchema>;
export type CapabilityId = (typeof capabilityIds)[number];
export type ModuleSelection = z.infer<typeof moduleSelectionSchema>;
export type ResolvedModules = z.infer<typeof resolvedModulesSchema>;
export type ProductIdentityInput = z.input<typeof productIdentitySchema>;
export type ProductIdentity = z.output<typeof productIdentitySchema> & {
  displayName: string;
};
export type DesignInput = z.input<typeof designSchema>;
export type Design = z.output<typeof designSchema>;

export type NormalizedRecipe = z.infer<typeof normalizedRecipeSchema>;
