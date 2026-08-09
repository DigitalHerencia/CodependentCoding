import { mkdir, mkdtemp, readFile, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createProject } from '@loaded-vibes/core';

const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

async function assertLocalImportsResolve(root: string): Promise<void> {
  const sourceFiles: string[] = [];
  async function walk(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (
        sourceExtensions.some((extension) => entry.name.endsWith(extension))
      )
        sourceFiles.push(absolute);
    }
  }
  for (const directory of [
    'app',
    'components',
    'content',
    'features',
    'lib',
    'schemas',
    'tests',
    'types',
  ]) {
    try {
      await walk(path.join(root, directory));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }
  const unresolved: string[] = [];
  for (const file of sourceFiles) {
    if (
      path.relative(root, file) ===
      path.join('tests', 'contract', 'architecture-validator.test.ts')
    )
      continue;
    const body = await readFile(file, 'utf8');
    for (const match of body.matchAll(
      /(?:from\s+|import\s*\()\s*["'](@\/[^"']+)["']/g,
    )) {
      const specifier = match[1];
      if (!specifier) continue;
      if (specifier.startsWith('@/prisma/generated/')) continue;
      const target = path.join(root, specifier.slice(2));
      const candidates = [
        ...sourceExtensions.map((extension) => `${target}${extension}`),
        ...sourceExtensions.map((extension) =>
          path.join(target, `index${extension}`),
        ),
      ];
      const resolved = await Promise.all(
        candidates.map(async (candidate) => {
          try {
            await stat(candidate);
            return true;
          } catch {
            return false;
          }
        }),
      );
      if (!resolved.some(Boolean))
        unresolved.push(`${path.relative(root, file)}: ${specifier}`);
    }
  }
  expect(unresolved).toEqual([]);
}

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
      preset: 'bare-golden-app',
    });
    expect(
      JSON.parse(await readFile(path.join(target, 'loadedvibes.json'), 'utf8')),
    ).toMatchObject({
      schemaVersion: 1,
      name: 'acme-product',
      product: 'bare-golden-app',
    });
    await expect(
      stat(path.join(target, 'app', '(public)', 'pricing')),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(
      stat(path.join(target, 'app', '(tenant)', 'projects')),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(
      stat(path.join(target, 'app', 'api', 'stripe', 'connect')),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(
      readFile(
        path.join(target, '.agents', 'contracts', 'routes.yaml'),
        'utf8',
      ),
    ).resolves.not.toContain('/projects');
    await assertLocalImportsResolve(target);
  });

  it('composes selected Vibes capability modules into one golden app', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'loaded-vibes-modules-'));
    const target = path.join(root, 'marketplace');
    await createProject({
      name: 'marketplace',
      product: 'platform-marketplace',
      targetDirectory: target,
      git: { initialize: false },
      install: { enabled: false },
    });
    await expect(
      stat(path.join(target, 'app', '(public)', 'pricing', 'page.tsx')),
    ).resolves.toBeTruthy();
    await expect(
      stat(path.join(target, 'app', '(tenant)', 'projects', 'page.tsx')),
    ).resolves.toBeTruthy();
    await expect(
      stat(
        path.join(
          target,
          'app',
          'api',
          'stripe',
          'connect',
          'webhooks',
          'route.ts',
        ),
      ),
    ).resolves.toBeTruthy();
    await expect(
      readFile(path.join(target, 'content', 'loadedvibes.ts'), 'utf8'),
    ).resolves.toContain('"stripeConnect": true');
    await expect(
      readFile(
        path.join(target, '.agents', 'contracts', 'routes.yaml'),
        'utf8',
      ),
    ).resolves.toContain('/api/stripe/connect/webhooks');
    await assertLocalImportsResolve(target);
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
