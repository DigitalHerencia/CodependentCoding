import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { entries, singleSpec, gh, json, parseOptions } from './common.mjs';
import { render } from './render-issue.mjs';

// Dry-run is the default; --apply explicitly creates missing issues only.
try {
  const { apply, all, id } = parseOptions(process.argv.slice(2), ['apply','all','id']);
  if ((all ? 1 : 0) + (id ? 1 : 0) !== 1) throw new Error('Specify exactly one of --id SPEC-ID or --all');
  const specs = all ? entries() : [singleSpec(id)];
  const project = json('.github/project.json');
  const repo = project.repository;
  if (!apply) {
    for (const { spec } of specs) console.log(`DRY RUN: ${spec.github.title} | milestone: ${spec.github.milestone} | labels: ${spec.github.labels.join(', ')}`);
    console.log(`No writes. ${specs.length} candidate issues. Run sync-taxonomy.mjs --apply first; then use --apply here if approved.`);
  } else {
    // Refuse to publish unfilled templates. Preflight the whole batch before any write.
    const incomplete = specs.filter(({ spec }) =>
      !spec.specification.objective.trim() || spec.specification.acceptance_criteria.length === 0
      || (spec.specification.validation.commands.length === 0 && spec.specification.validation.manual_checks.length === 0));
    if (incomplete.length) throw new Error(
      `Refusing to publish ${incomplete.length} incomplete spec(s); fill objective, acceptance criteria and validation first. First: ${incomplete[0].id}`);
    // gh issue list exposes title/number/url; deduplicate exactly on the spec ID.
    const existing = JSON.parse(gh(['issue','list','--repo',repo,'--state','all','--limit','1000','--json','title,number,url']));
    const tmp = mkdtempSync(join(tmpdir(),'cc-governance-'));
    try {
      for (const { spec } of specs) {
        const prefix = `[${spec.id}] `;
        if (existing.some((issue) => issue.title.startsWith(prefix))) {
          console.log(`SKIP (existing issue): ${spec.id}`);
          continue;
        }
        const bodyPath = join(tmp,`${spec.id}.md`);
        writeFileSync(bodyPath,render(spec),'utf8');
        const args = ['issue','create','--repo',repo,'--title',spec.github.title,'--body-file',bodyPath,'--milestone',spec.github.milestone];
        for (const label of spec.github.labels) args.push('--label',label);
        const issueUrl = gh(args);
        console.log(`CREATED: ${spec.id} ${issueUrl}`);
        existing.push({title:spec.github.title,url:issueUrl});
        // Project v2 addition is optional; never infer a project number.
        if (Number.isInteger(project.project_number) && project.project_number > 0) {
          gh(['project','item-add',String(project.project_number),'--owner',project.owner,'--url',issueUrl]);
          console.log(`ADDED to Project v2 #${project.project_number}: ${spec.id}`);
        }
      }
    } finally { rmSync(tmp,{recursive:true,force:true}); }
  }
} catch(e){console.error(`ERROR: ${e.message}`);process.exitCode=1;}
