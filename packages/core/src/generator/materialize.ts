import {
  cp,
  lstat,
  mkdir,
  readFile,
  rename,
  rm,
  rmdir,
  readdir,
} from 'node:fs/promises';
import path from 'node:path';
import { LoadedVibesError } from '../errors.js';
import type { GenerationPlan } from './plan.js';
import { applyTransforms } from './transforms.js';

async function copyOverlay(source: string, destination: string): Promise<void> {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name === '.loaded-vibes-module.json') continue;
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) await copyOverlay(sourcePath, destinationPath);
    else
      await cp(sourcePath, destinationPath, {
        force: true,
      });
  }
}

export async function materialize(plan: GenerationPlan): Promise<void> {
  try {
    await lstat(path.join(plan.templateDirectory, 'package.json'));
    await readFile(
      path.join(plan.templateDirectory, '.loaded-vibes-template.json'),
      'utf8',
    );
  } catch (error) {
    throw new LoadedVibesError(
      'TEMPLATE_INVALID',
      'Canonical template is missing required metadata.',
      error,
    );
  }
  let stagingCreated = false;
  try {
    await mkdir(plan.stagingDirectory, { recursive: false });
    stagingCreated = true;
    await cp(plan.templateDirectory, plan.stagingDirectory, {
      recursive: true,
      force: false,
    });
    for (const module of plan.modules) {
      await lstat(
        path.join(module.sourceDirectory, '.loaded-vibes-module.json'),
      );
      await copyOverlay(module.sourceDirectory, plan.stagingDirectory);
    }
    await applyTransforms(plan);
    try {
      await rmdir(plan.config.targetDirectory);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    await rename(plan.stagingDirectory, plan.config.targetDirectory);
  } catch (error) {
    if (stagingCreated) {
      await rm(plan.stagingDirectory, { recursive: true, force: true });
    }
    if (error instanceof LoadedVibesError) throw error;
    throw new LoadedVibesError(
      'COPY_FAILED',
      'Failed to materialize the canonical template.',
      error,
    );
  }
}
