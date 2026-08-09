import path from 'node:path';
import type { LoadedVibesConfig } from './config/schema.js';

export type GeneratedModuleId =
  | 'marketing'
  | 'sample-domain'
  | 'stripe-connect';

export interface GeneratedModule {
  id: GeneratedModuleId;
  sourceDirectory: string;
}

export function selectGeneratedModules(
  config: LoadedVibesConfig,
  templateDirectory: string,
): GeneratedModule[] {
  const root = path.resolve(templateDirectory, '../modules');
  const selected: GeneratedModuleId[] = [];
  if (config.recipe.modules.marketing) selected.push('marketing');
  if (config.recipe.modules.sampleDomain !== false)
    selected.push('sample-domain');
  if (config.recipe.modules.stripeConnect) selected.push('stripe-connect');
  return selected.map((id) => ({ id, sourceDirectory: path.join(root, id) }));
}
