import { lstat, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { LoadedVibesError } from '../errors.js';

async function exists(target: string): Promise<boolean> {
  try {
    await lstat(target);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

export async function assertSafeTarget(target: string): Promise<void> {
  const resolved = path.resolve(target);
  const root = path.parse(resolved).root;
  if (resolved === root || resolved === path.resolve(process.cwd())) {
    throw new LoadedVibesError(
      'UNSAFE_TARGET',
      `Refusing unsafe target: ${resolved}`,
    );
  }
  const relativeSegments = path
    .relative(root, resolved)
    .split(path.sep)
    .filter(Boolean);
  let current = root;
  for (const segment of relativeSegments) {
    current = path.join(current, segment);
    if (!(await exists(current))) break;
    if ((await lstat(current)).isSymbolicLink()) {
      throw new LoadedVibesError(
        'UNSAFE_TARGET',
        `Refusing path through symlink: ${current}`,
      );
    }
  }
  if (!(await exists(resolved))) return;
  const stat = await lstat(resolved);
  if (stat.isSymbolicLink()) {
    const destination = await realpath(resolved);
    throw new LoadedVibesError(
      'UNSAFE_TARGET',
      `Refusing symlink target resolving to ${destination}`,
    );
  }
  if (!stat.isDirectory()) {
    throw new LoadedVibesError(
      'TARGET_NOT_EMPTY',
      `Target exists and is not a directory: ${resolved}`,
    );
  }
  if ((await readdir(resolved)).length > 0) {
    throw new LoadedVibesError(
      'TARGET_NOT_EMPTY',
      `Target directory is not empty: ${resolved}`,
    );
  }
}
