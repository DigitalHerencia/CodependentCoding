import path from 'node:path';
import validatePackageName from 'validate-npm-package-name';
import { LoadedVibesError } from '../errors.js';
import { loadedVibesConfigSchema, type LoadedVibesConfig } from './schema.js';

export type ConfigInput = Partial<LoadedVibesConfig> & {
  git?: { initialize?: boolean };
  install?: { enabled?: boolean };
};

const configInputSchema = loadedVibesConfigSchema
  .partial()
  .extend({
    git: loadedVibesConfigSchema.shape.git.unwrap().partial().optional(),
    install: loadedVibesConfigSchema.shape.install
      .unwrap()
      .partial()
      .optional(),
  })
  .strict();

export function normalizeConfig(
  input: ConfigInput,
  cwd = process.cwd(),
): LoadedVibesConfig {
  const parsedInput = configInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new LoadedVibesError('INVALID_CONFIG', parsedInput.error.message);
  }
  const targetDirectory = path.resolve(
    cwd,
    parsedInput.data.targetDirectory ?? '',
  );
  const projectName =
    parsedInput.data.projectName ??
    path.basename(targetDirectory).toLowerCase();
  const validation = validatePackageName(projectName);
  if (!validation.validForNewPackages) {
    throw new LoadedVibesError(
      'INVALID_PROJECT_NAME',
      `Invalid project name "${projectName}": ${[...(validation.errors ?? []), ...(validation.warnings ?? [])].join('; ')}`,
    );
  }

  const result = loadedVibesConfigSchema.safeParse({
    schemaVersion: parsedInput.data.schemaVersion ?? 1,
    projectName,
    targetDirectory,
    preset: parsedInput.data.preset ?? 'standard',
    git: { initialize: parsedInput.data.git?.initialize ?? true },
    install: { enabled: parsedInput.data.install?.enabled ?? true },
  });
  if (!result.success) {
    throw new LoadedVibesError('INVALID_CONFIG', result.error.message);
  }
  return result.data;
}
