import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const artifactName = (await readdir('.artifacts')).find((name) =>
  name.endsWith('.tgz'),
);
if (!artifactName) throw new Error('No packed release artifact was found.');

const artifact = path.resolve('.artifacts', artifactName);
const root = await mkdtemp(path.join(os.tmpdir(), 'loaded-vibes-release-'));
const consumer = path.join(root, 'consumer');
const target = path.join(root, 'generated-app');
const recipePath = path.join(root, 'loadedvibes.json');
const pnpmCli = process.env.npm_execpath;
if (!pnpmCli) throw new Error('pnpm did not expose its executable path.');

function run(args) {
  const result = spawnSync(process.execPath, [pnpmCli, ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `pnpm ${args.join(' ')} failed.`,
        result.error?.message,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }
  return result;
}

try {
  await mkdir(consumer);
  await writeFile(
    path.join(consumer, 'package.json'),
    JSON.stringify({ name: 'loaded-vibes-release-smoke', private: true }),
  );
  await writeFile(
    recipePath,
    JSON.stringify({
      schemaVersion: 1,
      name: 'release-smoke',
      product: 'b2b-saas',
      identity: {
        displayName: 'Release Smoke',
        description: 'Generated from the packed CLI.',
      },
      design: {
        theme: 'electric',
        radius: 'rounded',
        density: 'compact',
        navigation: 'topbar',
        mode: 'dark',
      },
    }),
  );

  run(['--dir', consumer, 'add', '--ignore-scripts', artifact]);
  run([
    '--dir',
    consumer,
    'exec',
    'loaded-vibes',
    'create',
    target,
    '--config',
    recipePath,
    '--yes',
    '--no-git',
    '--skip-install',
  ]);

  const manifest = JSON.parse(
    await readFile(path.join(target, '.loadedvibes', 'manifest.json'), 'utf8'),
  );
  const product = await readFile(
    path.join(target, 'content', 'loadedvibes.ts'),
    'utf8',
  );
  const generatedPackage = JSON.parse(
    await readFile(path.join(target, 'package.json'), 'utf8'),
  );
  if (generatedPackage.name !== 'release-smoke') {
    throw new Error('Packed CLI did not apply the recipe package name.');
  }
  if (manifest.recipe.product !== 'b2b-saas') {
    throw new Error('Packed CLI did not persist the selected product preset.');
  }
  if (!manifest.recipe.modules.billing || !manifest.recipe.modules.marketing) {
    throw new Error(
      'Packed CLI did not compose representative preset modules.',
    );
  }
  if (!product.includes('"name": "Release Smoke"')) {
    throw new Error('Packed CLI did not apply product identity.');
  }
  await stat(path.join(target, 'app', '(public)', 'pricing', 'page.tsx'));
  console.log(
    'Packed CLI smoke passed: canonical create command generated the representative B2B SaaS recipe.',
  );
} finally {
  await rm(root, { recursive: true, force: true });
}
