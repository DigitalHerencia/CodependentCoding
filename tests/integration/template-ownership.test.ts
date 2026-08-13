import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('template ownership', () => {
  it('keeps generator metadata outside the standalone template', async () => {
    await expect(
      access(path.join(root, 'template', '.loaded-vibes-template.json')),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(
      readFile(
        path.join(root, 'packages', 'core', 'src', 'template-metadata.ts'),
        'utf8',
      ),
    ).resolves.toContain("templateId: 'loaded-vibes-maximal-saas'");
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
});
