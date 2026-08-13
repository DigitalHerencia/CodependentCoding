import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { LoadedVibesConfig } from '../config/schema.js';
import {
  resolveApplicationDefinition,
  type ApplicationGenerationPlan,
  type ResolvedApplicationDefinition,
} from '../application-definition.js';
import { excludedOwnedPaths } from '../ownership.js';

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
    excludedOwnedPaths: excludedOwnedPaths(config.recipe),
    stagingDirectory: path.join(
      parent,
      `.hipster-stack-${path.basename(config.targetDirectory)}-${randomUUID()}`,
    ),
    validationGates: [
      'pnpm install --frozen-lockfile',
      'pnpm db:generate',
      'pnpm validate:ci',
    ],
    applicationDefinition: application.resolved.definition,
    resolvedApplication: application.resolved,
    applicationPlan: application.plan,
  };
}
