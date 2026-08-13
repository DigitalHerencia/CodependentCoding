export {
  capabilityRegistry,
  resolveCapabilitySelection,
  type CapabilityDefinition,
  type CapabilityResolution,
} from './capabilities.js';
export {
  normalizeRecipe,
  resolveRecipe,
  type ResolvedBuildSummary,
  type ResolvedRecipe,
} from './recipe.js';
export { getProductPreset, productPresets } from './presets.js';
export {
  capabilityIds,
  defaultDesign,
  productPresetIds,
  recipeSchema,
  type CapabilityId,
  type Design,
  type ModuleSelection,
  type NormalizedRecipe,
  type ProductPresetId,
  type RecipeInput,
} from '@hipster-stack/schema';
