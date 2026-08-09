import path from 'node:path';
import { z } from 'zod';
import {
  recipeSchema,
  type DesignInput,
  type ModuleSelection,
  type ProductIdentityInput,
  type ProductPresetId,
  type RecipeInput,
} from '@loaded-vibes/schema';
import { LoadedVibesError } from '../errors.js';
import { normalizeRecipe } from '../recipe.js';
import { loadedVibesConfigSchema, type LoadedVibesConfig } from './schema.js';

export interface ConfigInput {
  recipe?: RecipeInput;
  schemaVersion?: 1;
  name?: string;
  product?: ProductPresetId;
  modules?: ModuleSelection;
  identity?: ProductIdentityInput;
  design?: DesignInput;
  /** @deprecated Use `name` or `recipe.name`. */
  projectName?: string;
  targetDirectory?: string;
  /** @deprecated The legacy standard preset maps to bare-golden-app. */
  preset?: 'standard';
  git?: { initialize?: boolean };
  install?: { enabled?: boolean };
}

const configInputSchema = z
  .object({
    recipe: recipeSchema.partial().optional(),
    schemaVersion: z.literal(1).optional(),
    name: z.string().optional(),
    product: recipeSchema.shape.product.unwrap().optional(),
    modules: recipeSchema.shape.modules.unwrap().optional(),
    identity: recipeSchema.shape.identity.unwrap().optional(),
    design: recipeSchema.shape.design.unwrap().optional(),
    projectName: z.string().optional(),
    targetDirectory: z.string().optional(),
    preset: z.literal('standard').optional(),
    git: z.object({ initialize: z.boolean().optional() }).strict().optional(),
    install: z.object({ enabled: z.boolean().optional() }).strict().optional(),
  })
  .strict();

export function normalizeConfig(
  input: ConfigInput,
  cwd = process.cwd(),
): LoadedVibesConfig {
  const parsedInput = configInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new LoadedVibesError('INVALID_CONFIG', parsedInput.error.message);
  }
  const targetDirectory = path.resolve(
    cwd,
    parsedInput.data.targetDirectory ?? '',
  );
  const suppliedNames = [
    parsedInput.data.recipe?.name,
    parsedInput.data.name,
    parsedInput.data.projectName,
  ].filter((value): value is string => value !== undefined);
  if (new Set(suppliedNames).size > 1) {
    throw new LoadedVibesError(
      'INVALID_CONFIG',
      'Recipe name, name, and legacy projectName must agree when combined.',
    );
  }
  const name = suppliedNames[0] ?? path.basename(targetDirectory).toLowerCase();
  const recipe = normalizeRecipe({
    ...parsedInput.data.recipe,
    schemaVersion:
      parsedInput.data.recipe?.schemaVersion ??
      parsedInput.data.schemaVersion ??
      1,
    name,
    product:
      parsedInput.data.recipe?.product ??
      parsedInput.data.product ??
      'bare-golden-app',
    modules: {
      ...parsedInput.data.recipe?.modules,
      ...parsedInput.data.modules,
    },
    identity: {
      ...parsedInput.data.recipe?.identity,
      ...parsedInput.data.identity,
    },
    design: {
      ...parsedInput.data.recipe?.design,
      ...parsedInput.data.design,
    },
  });

  const result = loadedVibesConfigSchema.safeParse({
    recipe,
    targetDirectory,
    git: { initialize: parsedInput.data.git?.initialize ?? true },
    install: { enabled: parsedInput.data.install?.enabled ?? true },
  });
  if (!result.success) {
    throw new LoadedVibesError('INVALID_CONFIG', result.error.message);
  }
  return result.data;
}
