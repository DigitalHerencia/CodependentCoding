import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { GenerationPlan } from './plan.js';

export async function applyTransforms(plan: GenerationPlan): Promise<void> {
  await rename(
    path.join(plan.stagingDirectory, 'gitignore.template'),
    path.join(plan.stagingDirectory, '.gitignore'),
  );
  const packagePath = path.join(plan.stagingDirectory, 'package.json');
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8')) as Record<
    string,
    unknown
  >;
  packageJson.name = plan.config.recipe.name;
  packageJson.version = '0.1.0';
  packageJson.private = true;
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

  const templateMetadata = JSON.parse(
    await readFile(
      path.join(plan.stagingDirectory, '.loaded-vibes-template.json'),
      'utf8',
    ),
  ) as Record<string, unknown>;
  const provenance = {
    schemaVersion: 1,
    generator: 'create-loaded-vibes',
    generatorVersion: '0.1.0',
    preset: plan.config.recipe.product,
    projectName: plan.config.recipe.name,
    templateRevision: templateMetadata.templateRevision,
    sourceRevision: templateMetadata.sourceRevision,
  };
  await writeFile(
    path.join(plan.stagingDirectory, '.loaded-vibes.json'),
    `${JSON.stringify(provenance, null, 2)}\n`,
  );
  await writeFile(
    path.join(plan.stagingDirectory, 'loadedvibes.json'),
    `${JSON.stringify(plan.config.recipe, null, 2)}\n`,
  );
}
