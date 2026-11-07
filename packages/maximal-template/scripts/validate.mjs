import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { root, read, json, catalog, entries } from './common.mjs';

function assert(yes, what) { if (!yes) throw new Error(what); }
const milestones = catalog.milestones;
assert(milestones.length === 3, 'Must have 3 milestones');
const phases = milestones.flatMap((m) => m.phases);
assert(phases.length === 9, 'Must have 9 phases');
const cycles = phases.flatMap((p) => p.dev_cycles);
assert(cycles.length === 20, 'Must have 20 dev cycles');
assert(cycles.every((c) => c.spec_ids.length === 5), 'Every dev cycle must have exactly 5 specs');
const specs = entries();
assert(specs.length === 100, 'Must have 100 specifications');
assert(new Set(specs.map((s) => s.id)).size === 100, 'Spec IDs must be unique');
const labels = new Set(json('.github/labels.json').labels.map((l) => l.name));
assert(labels.size === json('.github/labels.json').labels.length, 'Duplicate GitHub label');
const milestonesJson = json('.github/milestones.json').milestones;
const ontologyIds = new Set(json('context/ontologies.json').ontologies.map((x) => x.id));
assert(ontologyIds.size === 9, 'Must have exactly 9 ontology IDs');
const docs = {
  prd: ['PRD.md', 'PRD-'],
  tech_requirements: ['tech-requirements.md', 'TECH-'],
  architecture: ['Architecture.md', 'ARCH-'],
  auth: ['AUTH.md', 'AUTH-'],
  design: ['Design.md', 'DES-'],
};
for (const { id, spec, path, milestone, phase, cycle } of specs) {
  const t = spec.traceability;
  assert(spec.id === id && spec.work_code === `ENG-${id}`, `${id}: mismatched IDs`);
  assert(t.milestone_id === milestone.id && t.phase_id === phase.id && t.dev_cycle_id === cycle.id, `${id}: broken hierarchy`);
  assert(t.milestone_title === milestone.title && t.phase_title === phase.title && t.dev_cycle_title === cycle.title, `${id}: stale names`);
  assert(spec.issue_type === 'bug' || spec.issue_type === 'feature', `${id}: invalid issue type`);
  assert(spec.github.title.startsWith(`[${id}] `), `${id}: GitHub title has wrong prefix`);
  assert(spec.github.milestone === `${milestone.id} — ${milestone.title}`, `${id}: wrong GitHub milestone`);
  assert(milestonesJson.some((m) => m.title === spec.github.milestone), `${id}: missing milestone metadata`);
  assert(spec.github.labels.includes('tracked') && spec.github.labels.includes(`type:${spec.issue_type}`), `${id}: missing intake/type label`);
  for (const label of spec.github.labels) assert(labels.has(label), `${id}: unknown label ${label}`);
  for (const ontology of t.ontology_ids) assert(ontologyIds.has(ontology), `${id}: invalid ontology ${ontology}`);
  for (const [key, [doc, prefix]] of Object.entries(docs)) {
    const ref = spec.documentation[key];
    assert(ref.file === `context/docs/${doc}` && ref.requirement_id === `${prefix}${id}`, `${id}: invalid ${key} document linkage`);
    const content = read(ref.file);
    assert(content.includes(`\`${prefix}${id}\``), `${id}: missing linked authoring slot in ${doc}`);
    assert(content.includes(`../specs/${milestone.id}/${phase.id}/${cycle.id.split('-').at(-1)}/${id}.json`), `${id}: missing relative link in ${doc}`);
  }
  for (const name of ['application','validation','design']) {
    const contract = `.agents/contracts/${name}.yaml`;
    assert(spec.contracts[name] === contract, `${id}: missing contract link ${name}`);
    assert(read(contract).includes(`spec_id: ${id}\n`), `${id}: not bound in ${name} contract`);
  }
  assert(existsSync(join(root, path)), `${id}: missing JSON file`);
}
const ledger = json('.agents/execution/progress.json').entries;
assert(ledger.length === 100 && new Set(ledger.map((x) => x.spec_id)).size === 100, 'Progress ledger must map all 100 specs');
assert(ledger.every((x) => !x.validation_runs.length), 'Template must not claim unexecuted checks');
for (const name of ['decisions','handoff']) assert(existsSync(join(root, `.agents/execution/${name}.json`)), `Missing ${name}.json`);
for (const name of ['bug','feature']) assert(existsSync(join(root, `.github/ISSUE_TEMPLATE/${name}.yml`)), `Missing GitHub issue form: ${name}`);
console.log('PASS: 3 milestones; 9 phases; 20 dev cycles; 100 linked JSON specs; 5 docs; 3 contracts; 3 execution files; labels and milestones valid.');
