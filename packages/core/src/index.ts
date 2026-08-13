export { createProject, type CreateOptions } from './commands/create.js';
export {
  applyProjectModuleAddition,
  planProjectModuleAddition,
  type ModuleAdditionPlan,
  type ModuleAdditionResult,
} from './commands/add.js';
export {
  diagnoseProject,
  type DiagnosticCheck,
  type DiagnosticOwner,
  type DiagnosticStatus,
  type DoctorResult,
} from './commands/doctor.js';
export { explainProject, type ProjectExplanation } from './commands/explain.js';
export { loadConfigFile } from './config/load.js';
export { normalizeConfig, type ConfigInput } from './config/normalize.js';
export {
  loadedVibesConfigSchema,
  type LoadedVibesConfig,
} from './config/schema.js';
export { LoadedVibesError, type LoadedVibesErrorCode } from './errors.js';
export {
  generatedModuleIds,
  getAddableOwnership,
  optionalSurfaceOwnership,
  selectedGeneratedModuleIds,
  excludedOwnedPaths,
  type GeneratedModuleId,
  type OptionalSurfaceOwnership,
} from './ownership.js';
export {
  generationManifestSchema,
  parseGenerationManifest,
  type GenerationManifest,
} from './manifest.js';
export { loadGeneratedProject, type GeneratedProject } from './project.js';
export {
  capabilityRegistry,
  resolveCapabilitySelection,
  type CapabilityDefinition,
  type CapabilityResolution,
} from './capabilities.js';
export { capabilityIds, productPresetIds } from '@hipster-stack/schema';
export {
  normalizeRecipe,
  resolveRecipe,
  type ResolvedBuildSummary,
  type ResolvedRecipe,
} from './recipe.js';
export { getProductPreset, productPresets } from './presets.js';
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
} from '@hipster-stack/schema';
