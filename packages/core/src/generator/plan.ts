import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { LoadedVibesConfig } from '../config/schema.js';

export interface GenerationPlan {
  config: LoadedVibesConfig;
  templateDirectory: string;
  stagingDirectory: string;
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
    stagingDirectory: path.join(
      parent,
      `.loaded-vibes-${path.basename(config.targetDirectory)}-${randomUUID()}`,
    ),
    validationGates: [
      'pnpm install --frozen-lockfile',
      'pnpm db:generate',
      'pnpm validate:ci',
    ],
  };
}
