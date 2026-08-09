import path from 'node:path';
import type { LoadedVibesConfig } from './config/schema.js';
import type { NormalizedRecipe } from '@loaded-vibes/schema';

export const generatedModuleIds = [
  'marketing',
  'sample-domain',
  'stripe-connect',
] as const;

export type GeneratedModuleId = (typeof generatedModuleIds)[number];

export interface GeneratedModule {
  id: GeneratedModuleId;
  sourceDirectory: string;
}

export function selectGeneratedModules(
  config: LoadedVibesConfig,
  templateDirectory: string,
): GeneratedModule[] {
  const root = path.resolve(templateDirectory, '../modules');
  const selected = selectedGeneratedModuleIds(config.recipe);
  return selected.map((id) => ({ id, sourceDirectory: path.join(root, id) }));
}

export function selectedGeneratedModuleIds(
  recipe: NormalizedRecipe,
): GeneratedModuleId[] {
  const selected: GeneratedModuleId[] = [];
  if (recipe.modules.marketing) selected.push('marketing');
  if (recipe.modules.sampleDomain !== false) selected.push('sample-domain');
  if (recipe.modules.stripeConnect) selected.push('stripe-connect');
  return selected;
}
