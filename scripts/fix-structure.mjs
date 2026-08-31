import fs from 'node:fs';
import path from 'node:path';
import { compareTrees, copyTree, createReporter, exists, readData, root } from './lib.mjs';

const write = process.argv.includes('--write');
const jsonMode = process.argv.includes('--json');
const report = createReporter(write ? 'fix-structure-write' : 'fix-structure-dry-run', jsonMode);
const app = readData('.agents/contracts/application.yaml');
const actions = [];

function action(kind, target, detail, apply) {
  actions.push({ kind, target, detail });
  if (write) apply();
}

for (const directory of ['.agents/contracts', '.agents/execution', 'scripts/governance']) {
  if (!exists(directory)) {
    action('mkdir', directory, 'Create missing governance directory.', () => fs.mkdirSync(path.join(root, directory), { recursive: true }));
  }
}

for (const yaml of ['application', 'design', 'validation']) {
  const canonical = `.agents/contracts/${yaml}.yaml`;
  const alias = `.agents/contracts/${yaml}.yml`;
  if (!exists(alias)) continue;
  if (!exists(canonical)) {
    report.error('FIX-001', 'Cannot remove alias because canonical .yaml is missing.', alias);
    continue;
  }
  const same = fs.readFileSync(path.join(root, canonical)).equals(fs.readFileSync(path.join(root, alias)));
  if (!same) {
    report.error('FIX-002', 'Competing .yml differs from canonical .yaml; manual reconciliation required.', alias);
    continue;
  }
  action('remove', alias, 'Remove byte-identical competing .yml alias.', () => fs.rmSync(path.join(root, alias)));
}

const canonicalPlugin = app.implementationEvidence.loadedVibesCanonicalSource;
const mirrorPlugin = app.implementationEvidence.loadedVibesMirror;
if (exists(canonicalPlugin)) {
  const comparison = compareTrees(canonicalPlugin, mirrorPlugin);
  if (!comparison.equal) {
    action('sync-mirror', mirrorPlugin, `Replace non-authoritative mirror from ${canonicalPlugin}; ${comparison.differences.length} path(s) differ.`, () => copyTree(canonicalPlugin, mirrorPlugin));
  }
} else {
  report.error('FIX-003', 'Canonical Loaded Vibes source is missing; mirror cannot be synchronized.', canonicalPlugin);
}

if (exists('template/lib/workflows')) {
  report.warn('FIX-PLAN-001', 'Workflow relocation is semantic and intentionally plan-only; no files were moved.', 'template/lib/workflows');
}

if (actions.length === 0) report.info('FIX-000', 'No safe mechanical corrections are currently required.');
else for (const item of actions) report.info('FIX-ACTION', `${write ? 'Applied' : 'Would apply'} ${item.kind}: ${item.detail}`, item.target);

report.finish({ mode: write ? 'write' : 'dry-run', actions: actions.length });
