import { existsSync } from "node:fs";
import { join } from "node:path";
import { root, read, json, catalog, entries, log } from "./common.mjs";

function assert(yes, what) {
  if (!yes) throw new Error(what);
}
const milestones = catalog.milestones;
assert(milestones.length === 3, "Must have 3 milestones");
const phases = milestones.flatMap((m) => m.phases);
assert(phases.length === 9, "Must have 9 phases");
const cycles = phases.flatMap((p) => p.dev_cycles);
assert(cycles.length === 20, "Must have 20 dev cycles");
assert(
  cycles.every((c) => c.spec_ids.length === 5),
  "Every dev cycle must have exactly 5 specs",
);
const specs = entries();
assert(specs.length === 100, "Must have 100 specifications");
assert(new Set(specs.map((s) => s.id)).size === 100, "Spec IDs must be unique");
const labels = new Set(json(".github/labels.json").labels.map((l) => l.name));
assert(
  labels.size === json(".github/labels.json").labels.length,
  "Duplicate GitHub label",
);
const milestonesJson = json(".github/milestones.json").milestones;
const ontologyIds = new Set(
  json("context/ontologies.json").ontologies.map((x) => x.id),
);
assert(ontologyIds.size === 9, "Must have exactly 9 ontology IDs");
const docFiles = [
  "PRD.md",
  "tech-requirements.md",
  "Architecture.md",
  "AUTH.md",
  "Design.md",
];
const slugify = (heading) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/ +/g, "-");
const sections = new Map(); // "file#slug" -> Set of work codes listed under **Feeds:**
for (const doc of docFiles) {
  const file = `context/docs/${doc}`;
  let current = null;
  for (const line of read(file).split(/\r?\n/)) {
    const heading = line.match(/^## (.+)$/);
    if (heading) {
      current = `${file}#${slugify(heading[1])}`;
      sections.set(current, new Set());
      continue;
    }
    if (current && line.startsWith("**Feeds:**"))
      for (const m of line.matchAll(/`(ENG-[^`]+)`/g))
        sections.get(current).add(m[1]);
  }
}
const cadences = ["once", "repeatable", "expandable", "gate"];
for (const { id, spec, path, milestone, phase, cycle } of specs) {
  const t = spec.traceability;
  assert(
    spec.id === id && spec.work_code === `ENG-${id}`,
    `${id}: mismatched IDs`,
  );
  assert(
    t.milestone_id === milestone.id &&
      t.phase_id === phase.id &&
      t.dev_cycle_id === cycle.id,
    `${id}: broken hierarchy`,
  );
  assert(
    t.milestone_title === milestone.title &&
      t.phase_title === phase.title &&
      t.dev_cycle_title === cycle.title,
    `${id}: stale names`,
  );
  assert(
    spec.issue_type === "bug" || spec.issue_type === "feature",
    `${id}: invalid issue type`,
  );
  assert(cadences.includes(spec.cadence), `${id}: invalid cadence`);
  assert(
    spec.sub_issues.length === 0 ||
      ["repeatable", "expandable"].includes(spec.cadence),
    `${id}: only repeatable or expandable specs may have sub-issues`,
  );
  for (const sub of spec.sub_issues)
    assert(
      sub.id.startsWith(`${spec.work_code}.`),
      `${id}: sub-issue ${sub.id} must extend the parent ID`,
    );
  assert(
    spec.github.title.startsWith(`[${spec.work_code}] `),
    `${id}: GitHub title has wrong prefix`,
  );
  assert(
    spec.github.milestone === `${milestone.id} — ${milestone.title}`,
    `${id}: wrong GitHub milestone`,
  );
  assert(
    milestonesJson.some((m) => m.title === spec.github.milestone),
    `${id}: missing milestone metadata`,
  );
  assert(
    spec.github.labels.includes("tracked") &&
      spec.github.labels.includes(`type:${spec.issue_type}`) &&
      spec.github.labels.includes(`cadence:${spec.cadence}`),
    `${id}: missing intake/type/cadence label`,
  );
  for (const label of spec.github.labels)
    assert(labels.has(label), `${id}: unknown label ${label}`);
  for (const ontology of t.ontology_ids)
    assert(ontologyIds.has(ontology), `${id}: invalid ontology ${ontology}`);
  assert(spec.documentation.length > 0, `${id}: not fed by any doc section`);
  for (const ref of spec.documentation) {
    const key = `${ref.file}#${ref.section}`;
    assert(sections.has(key), `${id}: unknown doc section ${key}`);
    assert(
      sections.get(key).has(spec.work_code),
      `${id}: ${key} does not list it under Feeds`,
    );
  }
  for (const name of ["application", "validation", "design"])
    assert(
      spec.contracts[name] === `.agents/contracts/${name}.yaml`,
      `${id}: missing contract link ${name}`,
    );
  assert(existsSync(join(root, path)), `${id}: missing JSON file`);
}
const ledger = json(".agents/execution/progress.json").entries;
assert(
  ledger.length === 100 && new Set(ledger.map((x) => x.spec_id)).size === 100,
  "Progress ledger must map all 100 specs",
);
assert(
  ledger.every((x) => !x.validation_runs.length),
  "Template must not claim unexecuted checks",
);
// Every doc section is translated by exactly one contract block (`source: <file>#<slug>`).
const contractSources = ["application", "validation", "design"].flatMap(
  (name) =>
    [
      ...read(`.agents/contracts/${name}.yaml`).matchAll(
        /^\s*source: (context\/docs\/\S+)$/gm,
      ),
    ].map((m) => m[1]),
);
for (const key of sections.keys())
  assert(
    contractSources.filter((s) => s === key).length === 1,
    `${key}: must appear exactly once as a contract source`,
  );
for (const src of contractSources)
  assert(sections.has(src), `contract source ${src} is not a doc section`);
const specCodes = new Set(specs.map((s) => s.spec.work_code));
for (const [key, codes] of sections) {
  assert(codes.size > 0, `${key}: section feeds no spec`);
  for (const code of codes)
    assert(specCodes.has(code), `${key}: lists unknown spec ${code}`);
  for (const code of codes)
    assert(
      specs
        .find((s) => s.spec.work_code === code)
        .spec.documentation.some((d) => `${d.file}#${d.section}` === key),
      `${key}: lists ${code}, but the spec does not reference it`,
    );
}
for (const name of ["decisions", "handoff"])
  assert(
    existsSync(join(root, `.agents/execution/${name}.json`)),
    `Missing ${name}.json`,
  );
for (const name of ["bug", "feature"])
  assert(
    existsSync(join(root, `.github/ISSUE_TEMPLATE/${name}.yml`)),
    `Missing GitHub issue form: ${name}`,
  );
log(
  "PASS: 3 milestones; 9 phases; 20 dev cycles; 100 linked JSON specs; every spec fed by a doc section; 5 docs; 3 contracts; 3 execution files; labels and milestones valid.",
);
