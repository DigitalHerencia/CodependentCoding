import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { LoadedVibesError } from '../errors.js';
import type { ConfigInput } from './normalize.js';

export async function loadConfigFile(
  filePath: string,
  cwd = process.cwd(),
): Promise<ConfigInput> {
  try {
    const contents = await readFile(path.resolve(cwd, filePath), 'utf8');
    return JSON.parse(contents) as ConfigInput;
  } catch (error) {
    throw new LoadedVibesError(
      'INVALID_CONFIG',
      `Unable to read config file: ${filePath}`,
      error,
    );
  }
}
