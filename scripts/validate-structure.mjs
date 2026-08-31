import fs from 'node:fs';
import path from 'node:path';
import { compareTrees, createReporter, exists, listChapterFiles, readData, root, walk } from './lib.mjs';

const jsonMode = process.argv.includes('--json');
const report = createReporter('structure', jsonMode);
const app = readData('.agents/contracts/application.yaml');

for (const required of app.repository.requiredTopLevelPaths ?? []) {
  if (!exists(required)) report.error('STR-001', 'Required repository path is missing.', required);
}

for (const required of [
  ...(app.repository.contextRequired?.docs ?? []),
  ...(app.repository.contextRequired?.mockups ?? []),
  ...(app.repository.contextRequired?.specAuthorityRoots ?? []),
]) {
  if (!exists(required)) report.error('STR-002', 'Required context authority path is missing.', required);
}

const ts = app.repository.typescripture;
const knowledge = listChapterFiles(ts.knowledgeBook);
const implementation = listChapterFiles(ts.implementationBook);
if (knowledge.length !== ts.pairedChapterCount || implementation.length !== ts.pairedChapterCount) {
  report.error('STR-003', `TypeScripture pairing requires ${ts.pairedChapterCount}+${ts.pairedChapterCount} chapter files; found ${knowledge.length}+${implementation.length}.`);
} else if (knowledge.some((name, i) => name !== implementation[i])) {
  const kNumbers = knowledge.map((name) => name.match(/^Chapter-(\d{2})\./)?.[1]);
  const iNumbers = implementation.map((name) => name.match(/^Chapter-(\d{2})\./)?.[1]);
  if (kNumbers.join(',') !== iNumbers.join(',')) report.error('STR-003', 'Knowledge and Implementation books must pair the same chapter numbers.');
}

const canonical = app.implementationEvidence.loadedVibesCanonicalSource;
const mirror = app.implementationEvidence.loadedVibesMirror;
if (!exists(canonical) || !exists(mirror)) {
  report.error('STR-004', 'Loaded Vibes canonical source and managed mirror must both exist.');
} else {
  const comparison = compareTrees(canonical, mirror);
  if (!comparison.equal) {
    report.error('STR-004', `Loaded Vibes mirror drifted from canonical source (${comparison.differences.length} differing path(s)).`, mirror);
  } else {
    report.info('STR-004', `Loaded Vibes mirror is byte-identical to canonical source (${comparison.canonicalFiles} files).`);
  }
}

if (exists('template/lib/workflows')) {
  report.warn('STR-005', 'Transitional workflow placement remains at template/lib/workflows/<domain>; new placement should follow lib/<domain>/workflows unless compatibility requires otherwise.', 'template/lib/workflows');
}

for (const yaml of ['application', 'design', 'validation']) {
  const canonicalYaml = `.agents/contracts/${yaml}.yaml`;
  const alias = `.agents/contracts/${yaml}.yml`;
  if (exists(alias)) {
    const same = fs.readFileSync(path.join(root, canonicalYaml)).equals(fs.readFileSync(path.join(root, alias)));
    report.error('STR-006', same ? 'Identical competing .yml alias exists; governance:fix --write may safely remove it.' : 'Competing .yml alias differs from canonical .yaml and requires manual reconciliation.', alias);
  }
}

const contextPluginRoots = walk('context/specs/loaded-vibes').filter((file) => path.basename(file) === 'plugin.json');
if (contextPluginRoots.length !== 1) report.warn('STR-007', `Expected one contextual Loaded Vibes package manifest under context/specs/loaded-vibes; found ${contextPluginRoots.length}.`);

report.finish({ knowledgeChapters: knowledge.length, implementationChapters: implementation.length });
