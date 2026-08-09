import { mkdtemp, mkdir, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { assertSafeTarget } from '../../src/preflight/target.js';

describe('assertSafeTarget', () => {
  it('accepts a missing destination', async () => {
    const root = await mkdtemp(
      path.join(os.tmpdir(), 'loaded-vibes-preflight-'),
    );
    await expect(
      assertSafeTarget(path.join(root, 'new-project')),
    ).resolves.toBeUndefined();
  });

  it('rejects occupied destinations', async () => {
    const target = await mkdtemp(
      path.join(os.tmpdir(), 'loaded-vibes-occupied-'),
    );
    await writeFile(path.join(target, 'keep.txt'), 'keep');
    await expect(assertSafeTarget(target)).rejects.toMatchObject({
      code: 'TARGET_NOT_EMPTY',
    });
  });

  it('rejects destination symlinks', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'loaded-vibes-symlink-'));
    const actual = path.join(root, 'actual');
    const link = path.join(root, 'link');
    await mkdir(actual);
    await symlink(actual, link, 'junction');
    await expect(assertSafeTarget(link)).rejects.toMatchObject({
      code: 'UNSAFE_TARGET',
    });
  });
});
