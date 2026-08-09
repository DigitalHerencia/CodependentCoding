import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { NormalizedRecipe } from '@loaded-vibes/schema';
import { LoadedVibesError } from './errors.js';
import {
  parseGenerationManifest,
  type GenerationManifest,
} from './manifest.js';
import { resolveRecipe } from './recipe.js';

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
    await readJson(path.join(target, '.loadedvibes', 'manifest.json')),
  );
  const recipe = resolveRecipe(
    (await readJson(path.join(target, 'loadedvibes.json'))) as NormalizedRecipe,
  ).recipe;
  if (JSON.stringify(manifest.recipe) !== JSON.stringify(recipe)) {
    throw new LoadedVibesError(
      'MODULE_CONFLICT',
      'loadedvibes.json and .loadedvibes/manifest.json disagree.',
    );
  }
  return { directory: target, manifest, recipe };
}
