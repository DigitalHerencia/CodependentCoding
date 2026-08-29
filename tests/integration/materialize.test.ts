import { mkdir, mkdtemp, readFile, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createProject } from '@hipster-stack/core';

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
  it('materializes the complete canonical template with structured identity transforms', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'hipster-stack-create-'));
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
        await readFile(path.join(target, '.hipster-stack.json'), 'utf8'),
      ),
    ).toMatchObject({
      projectName: 'acme-product',
      preset: 'bare-golden-app',
      templateId: 'loaded-vibes-maximal-saas',
      templateVersion: '1.0.0',
      composition: 'copy-one-template-retain-remove-transform',
      excludedOwnedPaths: expect.arrayContaining([
        'app/(public)/pricing',
        'app/(tenant)/projects',
      ]),
    });
    expect(
      JSON.parse(
        await readFile(path.join(target, 'hipsterstack.json'), 'utf8'),
      ),
    ).toMatchObject({
      applicationDefinition: {
        schemaVersion: 1,
        identity: { packageName: 'acme-product' },
        preset: 'bare-golden-app',
      },
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
      readFile(path.join(target, 'content', 'loadedvibes.ts'), 'utf8'),
    ).resolves.toContain('"marketing": false');
    for (const surface of [
      path.join('app', '(tenant)', 'uploads', 'page.tsx'),
      path.join('app', '(tenant)', 'maps', 'page.tsx'),
      path.join('app', '(tenant)', 'ai', 'page.tsx'),
      path.join('app', 'api', 'cloudinary', 'webhooks', 'route.ts'),
    ]) {
      await expect(stat(path.join(target, surface))).rejects.toMatchObject({
        code: 'ENOENT',
      });
    }
    for (const surface of [
      path.join('app', '(onboarding)'),
      path.join('app', '(tenant)', 'team'),
      path.join('app', '(admin)'),
      path.join('app', '(billing)'),
    ]) {
      await expect(stat(path.join(target, surface))).rejects.toMatchObject({
        code: 'ENOENT',
      });
    }
    expect(
      JSON.parse(
        await readFile(
          path.join(target, '.hipsterstack', 'manifest.json'),
          'utf8',
        ),
      ),
    ).toMatchObject({
      schemaVersion: 2,
      template: {
        id: 'loaded-vibes-maximal-saas',
        version: '1.0.0',
        composition: 'copy-one-template-retain-remove-transform',
      },
      excludedOwnedPaths: expect.arrayContaining([
        'app/(public)/pricing',
        'app/(tenant)/projects',
      ]),
    });
    await expect(
      readFile(
        path.join(target, '.agents', 'contracts', 'routes.yaml'),
        'utf8',
      ),
    ).resolves.not.toContain('/projects');
    await assertLocalImportsResolve(target);
  });

  it('composes selected repository-local capability modules into one application', async () => {
    const root = await mkdtemp(
      path.join(os.tmpdir(), 'hipster-stack-modules-'),
    );
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

  it('materializes a provider-free public application from explicit intent', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'hipster-stack-static-'));
    const target = path.join(root, 'public-site');
    await createProject({
      applicationDefinition: {
        schemaVersion: 1,
        preset: 'bare-golden-app',
        identity: { packageName: 'public-site' },
        providers: {
          authentication: 'none',
          persistence: { technology: 'none', provider: 'none' },
          commerce: 'none',
        },
        authorization: { model: 'none' },
        capabilities: {
          include: ['marketing'],
          exclude: [
            'organizations',
            'invitations',
            'rbac',
            'billing',
            'stripeConnect',
            'onboarding',
            'admin',
            'sampleDomain',
          ],
        },
      },
      targetDirectory: target,
      git: { initialize: false },
      install: { enabled: false },
    });
    const packageJson = JSON.parse(
      await readFile(path.join(target, 'package.json'), 'utf8'),
    ) as { dependencies: Record<string, string> };
    expect(packageJson.dependencies).not.toHaveProperty('@clerk/nextjs');
    expect(packageJson.dependencies).not.toHaveProperty('@prisma/client');
    expect(packageJson.dependencies).not.toHaveProperty('stripe');
    for (const removed of [
      path.join('app', '(auth)'),
      path.join('app', '(tenant)'),
      'prisma',
      'proxy.ts',
    ]) {
      await expect(stat(path.join(target, removed))).rejects.toMatchObject({
        code: 'ENOENT',
      });
    }
    await expect(
      readFile(path.join(target, 'app', 'layout.tsx'), 'utf8'),
    ).resolves.not.toContain('AppProviders');
    await expect(
      readFile(path.join(target, '.env.example'), 'utf8'),
    ).resolves.not.toMatch(/CLERK_|DATABASE_URL|STRIPE_/);
    await assertLocalImportsResolve(target);
  });

  it('wires product identity and semantic design choices into known surfaces', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'hipster-stack-design-'));
    const target = path.join(root, 'signal-desk');
    await createProject({
      name: 'signal-desk',
      product: 'bare-golden-app',
      identity: {
        displayName: 'Signal Desk',
        description: 'Decisions without the meeting sprawl.',
      },
      design: {
        theme: 'paper',
        mode: 'light',
        radius: 'rounded',
        density: 'compact',
        navigation: 'topbar',
      },
      targetDirectory: target,
      git: { initialize: false },
      install: { enabled: false },
    });
    const generatedDesign = await readFile(
      path.join(target, 'content', 'loadedvibes.ts'),
      'utf8',
    );
    expect(generatedDesign).toContain('"name": "Signal Desk"');
    expect(generatedDesign).toContain(
      '"description": "Decisions without the meeting sprawl."',
    );
    expect(generatedDesign).toContain('"theme": "paper"');
    expect(generatedDesign).toContain('"radius": "rounded"');
    expect(generatedDesign).toContain('"density": "compact"');
    expect(generatedDesign).toContain('"navigation": "topbar"');
    expect(generatedDesign).toContain('"mode": "light"');
    expect(generatedDesign).not.toContain('built with Hipster Stack');
    await expect(
      readFile(path.join(target, 'app', 'layout.tsx'), 'utf8'),
    ).resolves.toContain('data-theme={loadedVibesDesign.theme}');
    await expect(
      readFile(path.join(target, 'app', 'globals.css'), 'utf8'),
    ).resolves.toContain('[data-theme="paper"]');
    await expect(
      readFile(
        path.join(target, 'components', 'shells', 'tenant-shell.tsx'),
        'utf8',
      ),
    ).resolves.toContain("loadedVibesDesign.navigation === 'sidebar'");
    await expect(
      readFile(path.join(target, 'content', 'site.ts'), 'utf8'),
    ).resolves.toContain('name: loadedVibesProduct.name');
  });

  it('does not attempt to recreate an existing filesystem-root parent', async () => {
    const root = await mkdtemp(
      path.join(os.tmpdir(), 'hipster-stack-root-parent-'),
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
      path.join(os.tmpdir(), 'hipster-stack-empty-target-'),
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
