import { singleSpec, parseOptions } from './common.mjs';

export function render(spec) {
  const t = spec.traceability;
  const s = spec.specification;
  const lines = [
    `# ${spec.github.title}`, '',
    `**Spec ID:** \`${spec.id}\``,
    `**SOP Work Code:** \`${spec.work_code}\``,
    `**Milestone:** ${t.milestone_id} — ${t.milestone_title}`,
    `**Phase:** ${t.phase_id} — ${t.phase_title}`,
    `**Dev Cycle:** ${t.dev_cycle_id} — ${t.dev_cycle_title}`,
    `**Work type:** ${spec.issue_type}`, '',
    '## Objective and scope', '',
    s.objective || '_To be authored before execution._', '',
    '### Included', ...(s.scope.included.length ? s.scope.included.map((x) => `- ${x}`) : ['- _To be authored._']), '',
    '### Excluded', ...(s.scope.excluded.length ? s.scope.excluded.map((x) => `- ${x}`) : ['- _To be authored._']), '',
  ];
  if (spec.issue_type === 'bug') {
    lines.push('## Defect / corrective work context', '',
      '### Observed behavior and reproduction', spec.bug_details.actual_behavior || '_No observed defect established; fill in actual reproduction or the diagnostic triage objective._',
      ...spec.bug_details.steps_to_reproduce.map((x) => `- ${x}`), '',
      '### Expected behavior or corrective target',spec.bug_details.expected_behavior || '_To be authored._','');
  }
  for (const [heading, items] of [
    ['Requirements',s.requirements],['Inputs',s.inputs],['Deliverables',s.deliverables],
    ['Dependencies',s.dependencies],['Acceptance criteria',s.acceptance_criteria],
    ['Validation commands',s.validation.commands],['Manual validation',s.validation.manual_checks],
    ['Evidence required',s.validation.evidence_required]]) {
    lines.push(`## ${heading}`,'',...(items.length ? items.map((x) => `- ${typeof x === 'string' ? x : JSON.stringify(x)}`) : ['- _To be authored._']),'');
  }
  lines.push('## Documentation traceability','','| Document | Requirement ID | Source |','|---|---|---|');
  for (const [name,d] of Object.entries(spec.documentation)) lines.push(`| ${name} | \`${d.requirement_id}\` | \`${d.file}\` |`);
  lines.push('','## Agent contracts','',...Object.values(spec.contracts).map((x) => `- \`${x}\``),'',
    '## Execution evidence and handoff','','See `.agents/execution/{progress,decisions,handoff}.json`; never assert a passing check without actual evidence.','');
  return lines.join('\n');
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    const { id } = parseOptions(process.argv.slice(2), ['id']);
    if (!id) throw new Error('Usage: node scripts/governance/render-issue.mjs --id M1-P1.1-INIT-T01');
    process.stdout.write(render(singleSpec(id).spec));
  } catch (e) {console.error(`ERROR: ${e.message}`);process.exitCode=1;}
}
