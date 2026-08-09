export { createProject, type CreateOptions } from './commands/create.js';
export { loadConfigFile } from './config/load.js';
export { normalizeConfig, type ConfigInput } from './config/normalize.js';
export {
  loadedVibesConfigSchema,
  type LoadedVibesConfig,
} from './config/schema.js';
export { LoadedVibesError, type LoadedVibesErrorCode } from './errors.js';
export {
  capabilityRegistry,
  resolveCapabilitySelection,
  type CapabilityDefinition,
  type CapabilityResolution,
} from './capabilities.js';
export { capabilityIds, productPresetIds } from '@loaded-vibes/schema';
export {
  normalizeRecipe,
  resolveRecipe,
  type ResolvedBuildSummary,
  type ResolvedRecipe,
} from './recipe.js';
export { getProductPreset, productPresets } from '@loaded-vibes/recipes';
export type {
  CapabilityId,
  Design,
  DesignInput,
  ModuleSelection,
  NormalizedRecipe,
  ProductIdentity,
  ProductIdentityInput,
  ProductPresetId,
  RecipeInput,
} from '@loaded-vibes/schema';
