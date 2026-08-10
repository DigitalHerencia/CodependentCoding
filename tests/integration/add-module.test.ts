import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  applyProjectModuleAddition,
  createProject,
  planProjectModuleAddition,
} from '@loaded-vibes/core';

async function createBareProject(prefix: string): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), prefix));
  const target = path.join(root, 'app');
  await createProject({
    name: 'module-test-app',
    product: 'bare-golden-app',
    targetDirectory: target,
    git: { initialize: false },
    install: { enabled: false },
  });
  return target;
}

describe('post-generation module addition', () => {
  it('records a manifest and adds a supported module with updated provenance', async () => {
    const target = await createBareProject('loaded-vibes-add-marketing-');
    const initialManifest = JSON.parse(
      await readFile(
        path.join(target, '.loadedvibes', 'manifest.json'),
        'utf8',
      ),
    ) as { modules: string[] };
    expect(initialManifest.modules).toEqual([]);

    const plan = await planProjectModuleAddition(target, 'marketing');
    expect(plan.addedCapabilities).toEqual(['marketing']);
    expect(plan.prerequisites).toEqual([]);
    const result = await applyProjectModuleAddition(plan);
    expect(result.filesAdded.length).toBeGreaterThan(0);
    await expect(
      stat(path.join(target, 'app', '(public)', 'pricing', 'page.tsx')),
    ).resolves.toBeTruthy();
    const updatedManifest = JSON.parse(
      await readFile(
        path.join(target, '.loadedvibes', 'manifest.json'),
        'utf8',
      ),
    ) as { modules: string[]; recipe: { modules: { marketing: boolean } } };
    expect(updatedManifest.modules).toEqual(['marketing']);
    expect(updatedManifest.recipe.modules.marketing).toBe(true);
    await expect(
      readFile(
        path.join(target, '.agents', 'contracts', 'routes.yaml'),
        'utf8',
      ),
    ).resolves.toContain('/pricing');
  });

  it('resolves capability prerequisites and reports setup before applying', async () => {
    const target = await createBareProject('loaded-vibes-add-connect-');
    const plan = await planProjectModuleAddition(target, 'stripe-connect');
    expect(plan.addedCapabilities).toEqual(['billing', 'stripeConnect']);
    expect(plan.prerequisites).toEqual(['billing']);
    expect(plan.setup.join(' ')).toContain('STRIPE_CONNECT_WEBHOOK_SECRET');
    expect(plan.files).toContain(
      path.join('app', 'api', 'stripe', 'connect', 'webhooks', 'route.ts'),
    );
  });

  it('refuses to overwrite a user-modified intentional replacement', async () => {
    const target = await createBareProject('loaded-vibes-add-conflict-');
    const dashboard = path.join(
      target,
      'features',
      'dashboard',
      'dashboard-feature.tsx',
    );
    await writeFile(dashboard, '// user-owned dashboard\n');
    await expect(
      planProjectModuleAddition(target, 'sample-domain'),
    ).rejects.toMatchObject({ code: 'MODULE_CONFLICT' });
    await expect(readFile(dashboard, 'utf8')).resolves.toBe(
      '// user-owned dashboard\n',
    );
  });
});
