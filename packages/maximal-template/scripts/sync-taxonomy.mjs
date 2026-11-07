import { json, gh, parseOptions } from './common.mjs';

// Non-destructive by default. Apply only creates missing labels and milestones.
try {
  const { apply } = parseOptions(process.argv.slice(2), ['apply']);
  const labels = json('.github/labels.json').labels;
  const milestones = json('.github/milestones.json').milestones;
  const repo = json('.github/project.json').repository;
  if (!apply) {
    console.log(`DRY RUN: ${repo} — would ensure ${labels.length} labels and ${milestones.length} milestones exist.`);
    console.log('No changes made. Re-run with --apply to create missing items only.');
  } else {
    const existingLabels = new Set(JSON.parse(gh(['label','list','--repo',repo,'--limit','500','--json','name'])).map((x) => x.name));
    for (const label of labels) {
      if (existingLabels.has(label.name)) continue;
      gh(['label','create',label.name,'--repo',repo,'--color',label.color,'--description',label.description]);
      console.log(`Created label: ${label.name}`);
    }
    const existingMilestones = JSON.parse(gh(['api',`repos/${repo}/milestones?state=all&per_page=100`]));
    for (const milestone of milestones) {
      if (existingMilestones.some((m) => m.title === milestone.title)) continue;
      gh(['api','-X','POST',`repos/${repo}/milestones`,'-f',`title=${milestone.title}`,'-f',`description=${milestone.description}`]);
      console.log(`Created milestone: ${milestone.title}`);
    }
    console.log('Completed: existing labels/milestones preserved. No Project v2 settings changed.');
  }
} catch (e) {console.error(`ERROR: ${e.message}`);process.exitCode=1;}
