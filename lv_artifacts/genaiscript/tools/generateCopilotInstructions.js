/**
 * Generates Copilot Instructions from Parsed Specs
 */

export function generateCopilotInstructions(prd, tech) {
  const lines = [];

  lines.push('---');
  lines.push("description: 'Project-specific instructions derived from PRD and Tech Requirements'");
  lines.push("applyTo: '**'");
  lines.push('---');
  lines.push('');
  lines.push('# Project Specifications');
  lines.push('');
  lines.push('## Product Context');
  lines.push(`**Product:** ${prd.product.name} (v${prd.product.version})`);
  lines.push(`**Description:** ${prd.product.description}`);
  lines.push('');

  lines.push('## Goals');
  prd.goals.forEach((g) => lines.push(`- ${g}`));
  lines.push('');

  lines.push('## Features & Requirements');
  prd.features.forEach((f) => {
    lines.push(`### ${f.name} (${f.id})`);
    lines.push(f.description);
    lines.push('**Requirements:**');
    f.requirements.forEach((r) => lines.push(`- ${r}`));
    lines.push('');
  });

  lines.push('## Technical Stack');
  if (tech.stack && tech.stack.core) {
    const core = tech.stack.core;
    lines.push(`- **Framework:** ${core.framework.name} ${core.framework.version}`);
    lines.push(`- **Language:** ${core.language.name} ${core.language.version}`);
    lines.push(`- **Database:** ${core.database.name} ${core.database.version}`);
    if (core.auth) lines.push(`- **Auth:** ${core.auth.name}`);
  }
  lines.push('');

  lines.push('## Architecture');
  if (tech.architecture) {
    lines.push(`**Pattern:** ${tech.architecture.pattern}`);
    if (tech.architecture.requirements) {
      tech.architecture.requirements.forEach((r) => lines.push(`- ${r}`));
    }
  }

  lines.push('');
  lines.push('## Database Schema');
  if (tech.database) {
    lines.push(`**Strategy:** ${tech.database.strategy}`);
    if (tech.database.requirements) {
      tech.database.requirements.forEach((r) => lines.push(`- ${r}`));
    }
  }

  return lines.join('\n');
}
