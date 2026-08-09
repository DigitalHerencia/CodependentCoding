import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('template ownership', () => {
  it('uses repository-local template identity without external source provenance', async () => {
    const metadata = JSON.parse(
      await readFile(
        path.join(root, 'templates', 'golden', '.loaded-vibes-template.json'),
        'utf8',
      ),
    ) as Record<string, unknown>;
    expect(metadata).toMatchObject({
      schemaVersion: 2,
      templateId: 'loaded-vibes-maximal-saas',
      templateVersion: '1.0.0',
    });
    expect(metadata).not.toHaveProperty('sourceRepository');
    expect(metadata).not.toHaveProperty('sourceRevision');
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
      path.join('context', 'docs', 'tech-req.md'),
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
