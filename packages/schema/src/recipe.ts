import { z } from 'zod';

export const recipeSchemaVersion = 1 as const;

export const recipeSchema = z
  .object({
    schemaVersion: z.literal(recipeSchemaVersion).default(recipeSchemaVersion),
    name: z.string().trim().min(1, 'Recipe name is required.'),
    product: z.literal('bare-golden-app').default('bare-golden-app'),
  })
  .strict();

export type RecipeInput = z.input<typeof recipeSchema>;
export type NormalizedRecipe = z.output<typeof recipeSchema>;
