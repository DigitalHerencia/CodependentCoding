import path from 'node:path';
import type { LoadedVibesConfig } from '../config/schema.js';
import {
  resolveApplicationDefinition,
  type ApplicationGenerationPlan,
  type ResolvedApplicationDefinition,
} from '../application-definition.js';
import { excludedOwnedPathsForApplication } from '../ownership.js';

export interface GenerationPlan {
  config: LoadedVibesConfig;
  templateDirectory: string;
  stagingDirectory: string;
  excludedOwnedPaths: readonly string[];
  validationGates: readonly string[];
  applicationDefinition: ResolvedApplicationDefinition['definition'];
  resolvedApplication: ResolvedApplicationDefinition;
  applicationPlan: ApplicationGenerationPlan;
}

export function createGenerationPlan(
  config: LoadedVibesConfig,
  templateDirectory: string,
): GenerationPlan {
  const parent = path.dirname(config.targetDirectory);
  const application = resolveApplicationDefinition(
    config.applicationDefinition,
  );
  return {
    config,
    templateDirectory,
    excludedOwnedPaths: excludedOwnedPathsForApplication(
      application.plan.selectedCapabilities,
      application.plan.selectedProviders,
      application.plan.filesOmitted,
    ),
    stagingDirectory: path.join(
      parent,
      `.hipster-stack-${path.basename(config.targetDirectory)}-staging`,
    ),
    validationGates: application.plan.validationRequirements,
    applicationDefinition: application.resolved.definition,
    resolvedApplication: application.resolved,
    applicationPlan: application.plan,
  };
}
