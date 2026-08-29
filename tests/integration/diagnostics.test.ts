import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createProject,
  diagnoseProject,
  explainProject,
} from '@hipster-stack/core';

async function generatedProject(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'hipster-stack-doctor-'));
  const target = path.join(root, 'app');
  await createProject({
    name: 'diagnostic-app',
    product: 'bare-golden-app',
    identity: { displayName: 'Diagnostic App' },
    targetDirectory: target,
    git: { initialize: false },
    install: { enabled: false },
  });
  return target;
}

describe('doctor and explain', () => {
  it('reports missing local and provider setup with exact actions', async () => {
    const target = await generatedProject();
    const result = await diagnoseProject(target);
    expect(result.ok).toBe(false);
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'dependencies',
          status: 'fail',
          action: 'Run corepack pnpm install.',
        }),
        expect.objectContaining({
          id: 'prisma-client',
          status: 'fail',
          action: 'Run corepack pnpm db:generate.',
        }),
        expect.objectContaining({
          id: 'env:CLERK_SECRET_KEY',
          owner: 'user-setup',
          status: 'fail',
        }),
      ]),
    );
  });

  it('passes bounded readiness checks when prerequisites are present', async () => {
    const target = await generatedProject();
    await mkdir(path.join(target, 'node_modules'));
    await mkdir(path.join(target, 'prisma', 'generated', 'prisma'), {
      recursive: true,
    });
    await writeFile(
      path.join(target, 'prisma', 'generated', 'prisma', 'client.ts'),
      'export {}\n',
    );
    await writeFile(
      path.join(target, '.env.local'),
      [
        'DATABASE_URL="postgresql://user:pass@demo-pooler.neon.tech/app"',
        'DIRECT_DATABASE_URL="postgresql://owner:pass@demo.neon.tech/app"',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_example"',
        'CLERK_SECRET_KEY="sk_test_example"',
        'CLERK_WEBHOOK_SIGNING_SECRET="whsec_example"',
      ].join('\n'),
    );
    await expect(diagnoseProject(target)).resolves.toMatchObject({ ok: true });
  });

  it('explains recipe capabilities, design, boundaries, and remaining setup', async () => {
    const target = await generatedProject();
    const explanation = await explainProject(target);
    expect(explanation).toMatchObject({
      product: 'Diagnostic App',
      preset: { id: 'bare-golden-app', label: 'Bare golden app' },
      modules: [],
      design: ['obsidian', 'system', 'medium', 'comfortable', 'sidebar'],
    });
    expect(explanation.capabilities).toEqual(
      expect.arrayContaining([
        'Organizations',
        'Local roles and authorization',
        'Generated project guidance',
      ]),
    );
    expect(explanation.providers.join(' ')).toContain('Clerk owns identity');
    expect(explanation.remainingSetup.join(' ')).toContain(
      'Run corepack pnpm install.',
    );
  });
});
