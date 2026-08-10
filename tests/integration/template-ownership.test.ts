import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('template ownership', () => {
  it('uses repository-local template identity without external source provenance', async () => {
    const metadata = JSON.parse(
      await readFile(
        path.join(root, 'template', '.loaded-vibes-template.json'),
        'utf8',
      ),
    ) as Record<string, unknown>;
    expect(metadata).toMatchObject({
      schemaVersion: 2,
      templateId: 'loaded-vibes-maximal-saas',
      templateVersion: '1.0.0',
      composition: 'repository-local-maximal-template',
    });
    expect(metadata).not.toHaveProperty('sourceRepository');
    expect(metadata).not.toHaveProperty('sourceRevision');
  });

  it('keeps every supported capability in the canonical template', async () => {
    const template = path.join(root, 'template');
    for (const capabilityPath of [
      path.join('app', '(public)', 'pricing', 'page.tsx'),
      path.join('app', '(tenant)', 'projects', 'page.tsx'),
      path.join('app', 'api', 'stripe', 'connect', 'webhooks', 'route.ts'),
    ]) {
      await expect(
        stat(path.join(template, capabilityPath)),
      ).resolves.toBeTruthy();
    }

    await expect(stat(path.join(root, 'templates'))).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('has no external template synchronization command or script', async () => {
    const packageJson = JSON.parse(
      await readFile(path.join(root, 'package.json'), 'utf8'),
    ) as { scripts: Record<string, string> };
    expect(packageJson.scripts).not.toHaveProperty('template:sync');
    await expect(
      access(path.join(root, 'scripts', 'sync-template.ps1')),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('keeps active authority files free of the deleted repository', async () => {
    const authorityFiles = [
      'README.md',
      'package.json',
      path.join('context', 'README.md'),
      path.join('context', 'docs', 'architecture.md'),
      path.join('.agents', 'contracts', 'product.yaml'),
      path.join('.agents', 'contracts', 'architecture.yaml'),
    ];
    for (const file of authorityFiles) {
      const body = await readFile(path.join(root, file), 'utf8');
      expect(body, file).not.toContain('DigitalHerencia/Vibes');
      expect(body, file).not.toContain('Vibes-derived');
      expect(body, file).not.toContain('upstream Vibes');
    }
  });
});
