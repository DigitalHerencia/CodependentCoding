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
export { createGenerationPlan, type GenerationPlan } from './generator/plan.js';
export {
  applicationProperties,
  providerRegistry,
  resolveApplicationDefinition,
  type ApplicationGenerationPlan,
  type ApplicationResolution,
  type ResolutionReason,
  type ResolvedApplicationDefinition,
  type ResolvedArtifactSet,
} from './application-definition.js';
export {
  generatedModuleIds,
  getAddableOwnership,
  optionalSurfaceOwnership,
  selectedGeneratedModuleIds,
  excludedOwnedPaths,
  excludedOwnedPathsForApplication,
  providerSurfaceOwnership,
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
export {
  capabilityIds,
  designChoices,
  productPresetIds,
} from '@hipster-stack/schema';
export {
  applicationDefinitionFromRecipe,
  normalizeRecipe,
  recipeFromApplicationDefinition,
  recipeFromApplicationResolution,
  resolveRecipe,
  type ResolvedBuildSummary,
  type ResolvedRecipe,
} from './recipe.js';
export { getProductPreset, productPresets } from './presets.js';
export type {
  ApplicationDefinition,
  ApplicationDefinitionInput,
  Artifact,
  ArtifactSet,
  ArtifactSetId,
  AuthorizationModelId,
  CapabilityId,
  Constraint,
  Dependency,
  Design,
  DesignInput,
  ModuleSelection,
  NormalizedRecipe,
  OutputPolicy,
  PropertyDefinition,
  PropertyMechanism,
  PropertyState,
  ProductIdentity,
  ProductIdentityInput,
  ProductPresetId,
  ProviderDefinition,
  ProviderId,
  ProviderSelection,
  RecipeInput,
  ResourceDefinition,
  RoleDefinition,
  RouteSurfaceDefinition,
} from '@hipster-stack/schema';
