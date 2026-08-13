import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { LoadedVibesConfig } from '../config/schema.js';
import { excludedOwnedPaths } from '../ownership.js';

export interface GenerationPlan {
  config: LoadedVibesConfig;
  templateDirectory: string;
  stagingDirectory: string;
  excludedOwnedPaths: readonly string[];
  validationGates: readonly string[];
}

export function createGenerationPlan(
  config: LoadedVibesConfig,
  templateDirectory: string,
): GenerationPlan {
  const parent = path.dirname(config.targetDirectory);
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
  };
}
