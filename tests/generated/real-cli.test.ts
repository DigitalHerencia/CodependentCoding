import { mkdtemp, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, it } from 'vitest';

const cli = path.resolve('dist/cli.mjs');

describe('real user-facing CLI', () => {
  it('supports dry-run without writing a target', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'hipster-stack-dry-'));
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
    expect(result.stdout).toContain('Starting configuration: Bare golden app');
    await expect(stat(target)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('supports the canonical create subcommand', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'hipster-stack-create-'));
    const target = path.join(root, 'canonical-create');
    const result = await execa('node', [
      cli,
      'create',
      target,
      '--yes',
      '--dry-run',
      '--no-git',
      '--skip-install',
    ]);
    expect(result.stdout).toContain('Dry run complete');
    await expect(stat(target)).rejects.toMatchObject({ code: 'ENOENT' });
  }, 15_000);

  it('generates through the real CLI and reports skipped acceptance truthfully', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'hipster-stack-cli-'));
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
    const root = await mkdtemp(path.join(os.tmpdir(), 'hipster-stack-config-'));
    const target = path.join(root, 'Configured App');
    const config = path.join(root, 'hipster-stack.json');
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
  }, 15_000);

  it('rejects an occupied destination without changing it', async () => {
    const target = await mkdtemp(
      path.join(os.tmpdir(), 'hipster-stack-occupied-cli-'),
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
      path.join(os.tmpdir(), 'hipster-stack-determinism-'),
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
  }, 15_000);

  it('adds a supported module through the real CLI', async () => {
    const root = await mkdtemp(
      path.join(os.tmpdir(), 'hipster-stack-add-cli-'),
    );
    const target = path.join(root, 'add-app');
    await execa('node', [
      cli,
      target,
      '--name',
      'add-app',
      '--yes',
      '--no-git',
      '--skip-install',
    ]);
    const result = await execa('node', [
      cli,
      'add',
      'marketing',
      '--cwd',
      target,
    ]);
    expect(result.stdout).toContain('Optional surface: marketing');
    expect(result.stdout).toContain('Capabilities: marketing');
    await expect(
      stat(path.join(target, 'app', '(public)', 'pricing', 'page.tsx')),
    ).resolves.toBeTruthy();
  }, 15_000);

  it('diagnoses and explains a generated project without running validation suites', async () => {
    const root = await mkdtemp(
      path.join(os.tmpdir(), 'hipster-stack-diagnostics-cli-'),
    );
    const target = path.join(root, 'diagnostic-app');
    await execa('node', [
      cli,
      target,
      '--name',
      'diagnostic-app',
      '--yes',
      '--no-git',
      '--skip-install',
    ]);
    const doctor = await execa('node', [cli, 'doctor', '--cwd', target], {
      reject: false,
    });
    expect(doctor.exitCode).toBe(1);
    expect(doctor.stdout).toContain('Run corepack pnpm install.');
    expect(doctor.stdout).toContain('Add the Clerk secret key to .env.local.');
    const explain = await execa('node', [cli, 'explain', '--cwd', target]);
    expect(explain.stdout).toContain('Starting configuration: Bare golden app');
    expect(explain.stdout).toContain('Provider boundaries');
    expect(explain.stdout).toContain('Remaining setup');
  }, 15_000);
});
