import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export interface SourceNode {
  name: string;
  path: string;
  type: 'directory' | 'file';
  children?: SourceNode[];
}
const maximalRoot = path.resolve(process.cwd(), 'template');
const excluded = new Set([
  '.git',
  '.next',
  'node_modules',
  'coverage',
  '.turbo',
]);
const allowedExtension =
  /^(?:Dockerfile|LICENSE|README\.md|[^.].*\.(?:ts|tsx|js|jsx|mjs|cjs|json|md|css|scss|prisma|sql|yaml|yml|toml|txt|example))$/i;
function safeAbsolute(relativePath: string) {
  const normalized = relativePath.replaceAll('\\', '/').replace(/^\/+/, '');
  const absolute = path.resolve(maximalRoot, normalized);
  if (
    absolute !== maximalRoot &&
    !absolute.startsWith(`${maximalRoot}${path.sep}`)
  )
    throw new Error('Path leaves the Maximal Template root.');
  if (
    normalized
      .split('/')
      .some(
        (part) =>
          excluded.has(part) ||
          (part.startsWith('.env') && part !== '.env.example'),
      )
  )
    throw new Error('Source path is not public.');
  return absolute;
}
async function walk(relative = ''): Promise<SourceNode[]> {
  const entries = await readdir(safeAbsolute(relative), {
    withFileTypes: true,
  });
  const nodes: SourceNode[] = [];
  for (const entry of entries.sort(
    (a, b) =>
      Number(b.isDirectory()) - Number(a.isDirectory()) ||
      a.name.localeCompare(b.name),
  )) {
    if (
      excluded.has(entry.name) ||
      (entry.name.startsWith('.env') && entry.name !== '.env.example')
    )
      continue;
    const child = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory())
      nodes.push({
        name: entry.name,
        path: child,
        type: 'directory',
        children: await walk(child),
      });
    else if (allowedExtension.test(entry.name))
      nodes.push({ name: entry.name, path: child, type: 'file' });
  }
  return nodes;
}
export async function maximalTree() {
  return walk();
}
export async function readMaximalSource(relativePath: string) {
  const absolute = safeAbsolute(relativePath);
  if (!allowedExtension.test(path.basename(absolute)))
    throw new Error('Unsupported source type.');
  return readFile(absolute, 'utf8');
}
