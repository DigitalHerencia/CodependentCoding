import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(here, '../..');

export function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

export function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

export function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

export function readData(relativePath) {
  const text = readText(relativePath);
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${relativePath} must use the YAML 1.2 JSON subset / JSON syntax: ${error.message}`);
  }
}

export function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

export function walk(directory, options = {}) {
  const absolute = path.isAbsolute(directory) ? directory : path.join(root, directory);
  if (!fs.existsSync(absolute)) return [];
  const ignored = new Set(options.ignore ?? []);
  const result = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(absolute, entry.name);
    if (entry.isDirectory()) result.push(...walk(full, options));
    else result.push(full);
  }
  return result;
}

export function codeFiles(directory) {
  const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.cjs', '.cts']);
  return walk(directory, {
    ignore: ['.git', '.next', 'node_modules', 'dist', 'build', 'coverage', '.artifacts', 'generated'],
  }).filter((file) => extensions.has(path.extname(file)));
}

export function importsFrom(source) {
  const imports = [];
  const patterns = [
    /^[\t ]*(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/gm,
    /^[\t ]*(?:const|let|var)\s+[^=]+?=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/gm,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) imports.push(match[1]);
  }
  return [...new Set(imports)];
}

export function surfaceInner(relativeFile) {
  if (relativeFile.startsWith('template/')) {
    return { surface: 'template', inner: relativeFile.slice('template/'.length) };
  }
  return { surface: 'root', inner: relativeFile };
}

export function resolveLocalImport(relativeFile, specifier) {
  const { surface, inner } = surfaceInner(relativeFile);
  let target;
  if (specifier.startsWith('@/')) {
    target = specifier.slice(2);
  } else if (specifier.startsWith('.')) {
    target = path.posix.normalize(path.posix.join(path.posix.dirname(inner), specifier));
  } else {
    return null;
  }
  target = target.replace(/\.(?:jsx?|tsx?|mjs|mts|cjs|cts)$/, '');
  return { surface, target };
}

export function providerPackage(specifier) {
  return [
    /^stripe(?:\/|$)/,
    /^@clerk\//,
    /^@prisma\/client(?:\/|$)/,
    /^@prisma\/adapter-/,
    /^@neondatabase\//,
    /^@vercel\/blob(?:\/|$)/,
    /^cloudinary(?:\/|$)/,
    /^@aws-sdk\//,
    /^resend(?:\/|$)/,
    /^openai(?:\/|$)/,
    /^@huggingface\//,
  ].some((regex) => regex.test(specifier));
}

export function compareTrees(aRelative, bRelative) {
  const aRoot = path.join(root, aRelative);
  const bRoot = path.join(root, bRelative);
  const toMap = (base) => {
    if (!fs.existsSync(base)) return new Map();
    return new Map(
      walk(base).map((file) => [path.relative(base, file).split(path.sep).join('/'), sha256File(file)]),
    );
  };
  const a = toMap(aRoot);
  const b = toMap(bRoot);
  const names = [...new Set([...a.keys(), ...b.keys()])].sort();
  const differences = names
    .filter((name) => a.get(name) !== b.get(name))
    .map((name) => ({ path: name, canonical: a.get(name) ?? null, mirror: b.get(name) ?? null }));
  return { equal: differences.length === 0, canonicalFiles: a.size, mirrorFiles: b.size, differences };
}

export function createReporter(name, jsonMode = false) {
  const findings = [];
  const add = (level, id, message, file = null) => findings.push({ level, id, message, ...(file ? { file } : {}) });
  const api = {
    error: (id, message, file) => add('error', id, message, file),
    warn: (id, message, file) => add('warning', id, message, file),
    info: (id, message, file) => add('info', id, message, file),
    findings,
    finish(extra = {}) {
      const errors = findings.filter((item) => item.level === 'error').length;
      const warnings = findings.filter((item) => item.level === 'warning').length;
      const infos = findings.filter((item) => item.level === 'info').length;
      const summary = { validator: name, status: errors ? 'FAIL' : warnings ? 'PASS_WITH_WARNINGS' : 'PASS', errors, warnings, infos, ...extra };
      if (jsonMode) {
        console.log(JSON.stringify({ summary, findings }, null, 2));
      } else {
        for (const item of findings) {
          const prefix = item.level === 'error' ? 'ERROR' : item.level === 'warning' ? 'WARN ' : 'INFO ';
          console.log(`${prefix} ${item.id}${item.file ? ` ${item.file}` : ''}: ${item.message}`);
        }
        console.log(`${summary.status} ${name}: ${errors} error(s), ${warnings} warning(s), ${infos} info`);
      }
      if (errors) process.exitCode = 1;
      return summary;
    },
  };
  return api;
}

export function copyTree(sourceRelative, destinationRelative) {
  const source = path.join(root, sourceRelative);
  const destination = path.join(root, destinationRelative);
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

export function listChapterFiles(relativeDirectory) {
  const absolute = path.join(root, relativeDirectory);
  if (!fs.existsSync(absolute)) return [];
  return fs
    .readdirSync(absolute)
    .filter((name) => /^Chapter-\d{2}\..+\.md$/.test(name))
    .sort();
}
