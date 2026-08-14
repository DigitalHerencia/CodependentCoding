import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  ApplicationDefinitionInput,
  NormalizedRecipe,
} from '@hipster-stack/schema';
import { LoadedVibesError } from './errors.js';
import {
  parseGenerationManifest,
  type GenerationManifest,
} from './manifest.js';
import { recipeFromApplicationDefinition, resolveRecipe } from './recipe.js';

export interface GeneratedProject {
  directory: string;
  manifest: GenerationManifest;
  recipe: NormalizedRecipe;
}

async function readJson(file: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as unknown;
  } catch (error) {
    throw new LoadedVibesError(
      'PROJECT_NOT_GENERATED',
      `Unable to read generated project metadata at ${file}.`,
      error,
    );
  }
}

export async function loadGeneratedProject(
  directory: string,
): Promise<GeneratedProject> {
  const target = path.resolve(directory);
  const manifest = parseGenerationManifest(
    await readJson(path.join(target, '.hipsterstack', 'manifest.json')),
  );
  const saved = await readJson(path.join(target, 'hipsterstack.json'));
  const recipe =
    typeof saved === 'object' &&
    saved !== null &&
    'applicationDefinition' in saved
      ? recipeFromApplicationDefinition(
          (saved as { applicationDefinition: ApplicationDefinitionInput })
            .applicationDefinition,
        )
      : resolveRecipe(saved as NormalizedRecipe).recipe;
  if (JSON.stringify(manifest.recipe) !== JSON.stringify(recipe)) {
    throw new LoadedVibesError(
      'MODULE_CONFLICT',
      'hipsterstack.json and .hipsterstack/manifest.json disagree.',
    );
  }
  return { directory: target, manifest, recipe };
}
