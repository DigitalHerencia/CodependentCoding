import validatePackageName from 'validate-npm-package-name';
import {
  recipeSchema,
  type NormalizedRecipe,
  type RecipeInput,
} from '@loaded-vibes/schema';
import { LoadedVibesError } from './errors.js';

export function normalizeRecipe(input: RecipeInput): NormalizedRecipe {
  const parsed = recipeSchema.safeParse(input);
  if (!parsed.success) {
    throw new LoadedVibesError('INVALID_CONFIG', parsed.error.message);
  }

  const packageName = validatePackageName(parsed.data.name);
  if (!packageName.validForNewPackages) {
    throw new LoadedVibesError(
      'INVALID_PROJECT_NAME',
      `Invalid project name "${parsed.data.name}": ${[
        ...(packageName.errors ?? []),
        ...(packageName.warnings ?? []),
      ].join('; ')}`,
    );
  }

  return parsed.data;
}
