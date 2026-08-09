import { mkdir, mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createProject } from '../../src/commands/create.js';

describe('createProject', () => {
  it('materializes the canonical template with structured identity transforms', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'loaded-vibes-create-'));
    const target = path.join(root, 'Acme Product');
    const result = await createProject({
      projectName: 'acme-product',
      targetDirectory: target,
      git: { initialize: false },
      install: { enabled: false },
    });
    expect(result.status).toBe('generated-not-acceptance-validated');
    const packageJson = JSON.parse(
      await readFile(path.join(target, 'package.json'), 'utf8'),
    ) as { name: string };
    expect(packageJson.name).toBe('acme-product');
    expect(
      JSON.parse(
        await readFile(path.join(target, '.loaded-vibes.json'), 'utf8'),
      ),
    ).toMatchObject({
      projectName: 'acme-product',
      preset: 'standard',
    });
  });

  it('does not attempt to recreate an existing filesystem-root parent', async () => {
    const root = await mkdtemp(
      path.join(os.tmpdir(), 'loaded-vibes-root-parent-'),
    );
    const target = path.join(root, 'root-child');
    await expect(
      createProject({
        projectName: 'root-child',
        targetDirectory: target,
        git: { initialize: false },
        install: { enabled: false },
      }),
    ).resolves.toMatchObject({ status: 'generated-not-acceptance-validated' });
  });

  it('promotes safely into an existing empty destination', async () => {
    const root = await mkdtemp(
      path.join(os.tmpdir(), 'loaded-vibes-empty-target-'),
    );
    const target = path.join(root, 'empty-target');
    await mkdir(target);
    await expect(
      createProject({
        projectName: 'empty-target',
        targetDirectory: target,
        git: { initialize: false },
        install: { enabled: false },
      }),
    ).resolves.toMatchObject({ status: 'generated-not-acceptance-validated' });
    expect(
      JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8')),
    ).toMatchObject({
      name: 'empty-target',
    });
  });
});
