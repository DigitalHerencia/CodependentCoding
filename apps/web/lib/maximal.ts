import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..', '..', 'template');
export async function maximalSnapshot() {
  const entries = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort();
  const candidate = path.join(root, 'README.md');
  let preview: string;
  try {
    preview = await readFile(candidate, 'utf8');
  } catch {
    preview = 'Authoritative Maximal Template source.';
  }
  return {
    root: 'template/',
    entries,
    preview: preview.slice(0, 6000),
    source: 'template/',
  };
}
