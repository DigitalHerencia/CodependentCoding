// @ts-nocheck
import { strict as assert } from 'node:assert';
import test from 'node:test';
import { mkdtemp, rm, mkdir, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

import { createFileGuard } from '../fileGuard.js';

async function withTempRoot(fn) {
  const base = await mkdtemp(path.join(tmpdir(), 'loaded-vibes-guard-'));
  try {
    const root = path.join(base, '.loaded-vibes');
    await mkdir(root, { recursive: true });
    await fn(root, base);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
}

test('[fileGuard] allows writes within .loaded-vibes', async () => {
  await withTempRoot(async (allowedRoot) => {
    const guard = createFileGuard({ allowedRoot });
    const logsDir = path.join(allowedRoot, 'logs');
    await guard.mkdir(logsDir, { recursive: true });

    const logPath = path.join(logsDir, 'test.txt');
    await guard.writeFile(logPath, 'hello world', 'utf8');

    const content = await readFile(logPath, 'utf8');
    assert.equal(content, 'hello world');
  });
});

test('[fileGuard] blocks external writes without approval', async () => {
  await withTempRoot(async (allowedRoot, base) => {
    let prompted = false;
    const guard = createFileGuard({
      allowedRoot,
      prompt: async () => {
        prompted = true;
        return false;
      },
    });

    const outsidePath = path.join(base, 'README.md');
    await assert.rejects(() => guard.writeFile(outsidePath, 'nope', 'utf8'), /Bad Vibes Firewall/);
    assert.equal(prompted, true);
  });
});

test('[fileGuard] template copy approval whitelists destination root', async () => {
  await withTempRoot(async (allowedRoot, base) => {
    const projectRoot = path.join(base, 'project');
    await mkdir(projectRoot, { recursive: true });

    let observedSummary = '';
    const guard = createFileGuard({
      allowedRoot,
      prompt: async ({ summary }) => {
        observedSummary = summary;
        return true;
      },
    });

    await guard.approveTemplateCopy(projectRoot, [
      {
        source: '/templates/README.md',
        destination: path.join(projectRoot, 'README.md'),
        label: 'README',
      },
    ]);

    const targetFile = path.join(projectRoot, 'README.md');
    await guard.writeFile(targetFile, '# Welcome', 'utf8');
    const content = await readFile(targetFile, 'utf8');
    assert.equal(content, '# Welcome');
    assert.match(observedSummary, /Bad Vibes Firewall/);
    assert.match(observedSummary, /README/);
  });
});
