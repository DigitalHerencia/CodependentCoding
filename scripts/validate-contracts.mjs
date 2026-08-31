import path from 'node:path';
import { createReporter, exists, readData, root, sha256File } from './lib.mjs';

const jsonMode = process.argv.includes('--json');
const report = createReporter('contracts', jsonMode);
const contractPaths = [
  '.agents/contracts/application.yaml',
  '.agents/contracts/design.yaml',
  '.agents/contracts/validation.yaml',
];
const executionPaths = [
  '.agents/execution/decisions.json',
  '.agents/execution/progress.json',
  '.agents/execution/handoff.json',
];

const loaded = {};
for (const file of [...contractPaths, ...executionPaths]) {
  if (!exists(file)) {
    report.error('CONTRACT-001', 'Required governance file is missing.', file);
    continue;
  }
  try {
    loaded[file] = readData(file);
  } catch (error) {
    report.error('CONTRACT-002', error.message, file);
  }
}

const app = loaded['.agents/contracts/application.yaml'];
const design = loaded['.agents/contracts/design.yaml'];
const validation = loaded['.agents/contracts/validation.yaml'];

for (const [file, data] of Object.entries(loaded)) {
  if (file.includes('/contracts/') && data.contractVersion !== 1) {
    report.error('CONTRACT-003', 'contractVersion must be 1.', file);
  }
}
if (app?.serialization !== 'yaml-1.2-json-subset' || design?.serialization !== 'yaml-1.2-json-subset' || validation?.serialization !== 'yaml-1.2-json-subset') {
  report.error('CONTRACT-004', 'All YAML contracts must declare the YAML 1.2 JSON-subset serialization used by the dependency-free validators.');
}

if (app) {
  const ontologyCount = app.productFamily?.ontologies?.defaults?.length;
  if (ontologyCount !== 9) report.error('CONTRACT-005', `Expected exactly 9 canonical Ontologies; found ${ontologyCount ?? 'none'}.`);
  const simpleFamilies = app.productFamily?.simples?.exactTopLevelFamilies ?? [];
  if (simpleFamilies.length !== 2) report.error('CONTRACT-006', `Simples must have exactly two top-level families; found ${simpleFamilies.length}.`);
  const pipeline = app.generation?.pipeline ?? [];
  if (!pipeline.includes('dependency-closed Virgule') || pipeline.indexOf('dependency-closed Virgule') > pipeline.indexOf('materialize')) {
    report.error('CONTRACT-007', 'Dependency-closed Virgule must precede materialization authority.');
  }
}

if (design) {
  if ((design.mockups ?? []).length !== 10) report.error('CONTRACT-008', `Expected 10 authoritative mockups; found ${(design.mockups ?? []).length}.`);
  if ((design.tokens?.semanticTokenNames ?? []).length !== 52) report.error('CONTRACT-009', `Expected 52 normalized semantic design tokens; found ${(design.tokens?.semanticTokenNames ?? []).length}.`);
}

if (validation) {
  const states = new Set(validation.evidenceStates ?? []);
  for (const state of ['executed', 'skipped', 'blocked', 'inferred']) {
    if (!states.has(state)) report.error('CONTRACT-010', `Missing evidence state ${state}.`);
  }
}

for (const [contractPath, data] of Object.entries({
  '.agents/contracts/application.yaml': app,
  '.agents/contracts/design.yaml': design,
  '.agents/contracts/validation.yaml': validation,
})) {
  for (const source of data?.sourceManifest ?? []) {
    const relative = source.path;
    if (!exists(relative)) {
      report.error('CONTRACT-011', 'Source-manifest path no longer exists.', relative);
      continue;
    }
    if (source.sha256) {
      const actual = sha256File(path.join(root, relative));
      if (actual !== source.sha256) report.error('CONTRACT-012', `Source changed since ${contractPath} was derived; regenerate/reconcile the contract.`, relative);
    }
  }
}

report.finish({ contracts: contractPaths.length, executionFiles: executionPaths.length });
