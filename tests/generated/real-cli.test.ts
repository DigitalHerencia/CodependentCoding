import { mkdtemp, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, it } from 'vitest';

const cli = path.resolve('dist/cli.mjs');

describe('real user-facing CLI', () => {
  it('supports dry-run without writing a target', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'loaded-vibes-dry-'));
    const target = path.join(root, 'dry-project');
    const result = await execa('node', [
      cli,
      target,
      '--yes',
      '--dry-run',
      '--no-git',
      '--skip-install',
    ]);
    expect(result.stdout).toContain('Build review');
    expect(result.stdout).toContain('Bare golden app');
    await expect(stat(target)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('generates through the real CLI and reports skipped acceptance truthfully', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'loaded-vibes-cli-'));
    const target = path.join(root, 'Fresh App');
    const result = await execa('node', [
      cli,
      target,
      '--name',
      'fresh-app',
      '--yes',
      '--no-git',
      '--skip-install',
    ]);
    expect(result.stdout).toContain('acceptance validation were skipped');
    expect(
      JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8')),
    ).toMatchObject({ name: 'fresh-app' });
    await expect(
      readFile(path.join(target, '.gitignore'), 'utf8'),
    ).resolves.toContain('.next/');
    await expect(stat(path.join(target, '.git'))).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('normalizes a strict non-interactive config file through the real CLI', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'loaded-vibes-config-'));
    const target = path.join(root, 'Configured App');
    const config = path.join(root, 'loaded-vibes.json');
    await writeFile(
      config,
      JSON.stringify({
        schemaVersion: 1,
        name: 'configured-app',
        product: 'bare-golden-app',
        targetDirectory: target,
        git: { initialize: false },
        install: { enabled: false },
      }),
    );
    await execa('node', [cli, '--config', config, '--yes']);
    expect(
      JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8')),
    ).toMatchObject({ name: 'configured-app' });
  });

  it('rejects an occupied destination without changing it', async () => {
    const target = await mkdtemp(
      path.join(os.tmpdir(), 'loaded-vibes-occupied-cli-'),
    );
    const marker = path.join(target, 'keep.txt');
    await writeFile(marker, 'keep');
    const result = await execa(
      'node',
      [cli, target, '--yes', '--skip-install'],
      { reject: false },
    );
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('TARGET_NOT_EMPTY');
    expect(await readFile(marker, 'utf8')).toBe('keep');
  });

  it('produces equivalent source for identical supported configuration', async () => {
    const root = await mkdtemp(
      path.join(os.tmpdir(), 'loaded-vibes-determinism-'),
    );
    const targets = [path.join(root, 'first'), path.join(root, 'second')];
    for (const target of targets) {
      await execa('node', [
        cli,
        target,
        '--name',
        'same-app',
        '--yes',
        '--no-git',
        '--skip-install',
      ]);
    }
    async function snapshot(
      directory: string,
    ): Promise<Record<string, string>> {
      const result: Record<string, string> = {};
      async function visit(current: string): Promise<void> {
        for (const entry of await readdir(current, { withFileTypes: true })) {
          const absolute = path.join(current, entry.name);
          const relative = path
            .relative(directory, absolute)
            .replaceAll(path.sep, '/');
          if (entry.isDirectory()) await visit(absolute);
          else result[relative] = await readFile(absolute, 'utf8');
        }
      }
      await visit(directory);
      return result;
    }
    expect(await snapshot(targets[0]!)).toEqual(await snapshot(targets[1]!));
  });
});
