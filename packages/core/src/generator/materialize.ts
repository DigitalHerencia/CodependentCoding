import { cp, lstat, mkdir, rename, rm, rmdir } from 'node:fs/promises';
import path from 'node:path';
import { LoadedVibesError } from '../errors.js';
import type { GenerationPlan } from './plan.js';
import { applyTransforms } from './transforms.js';

export async function materialize(plan: GenerationPlan): Promise<void> {
  try {
    await lstat(path.join(plan.templateDirectory, 'package.json'));
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
    for (const relative of plan.excludedOwnedPaths) {
      await rm(path.join(plan.stagingDirectory, relative), {
        recursive: true,
        force: true,
      });
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
