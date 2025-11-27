// @ts-nocheck

import {
  loadManifest,
  resolveFromGenai,
  loadCoreDocuments,
  readOptional,
} from '../shared/context.js';
import { readFile } from 'fs/promises';

script({
  title: 'Loaded Vibes Phase Runner',
  description:
    'Executes any DevCycle using instructions + toolsets defined in the manifest (legacy file path maintained for backward compatibility).',
  parameters: {
    phase: {
      type: 'string',
      description: 'DevCycle key to execute (e.g., scaffolding, testing).',
    },
    mode: {
      type: 'string',
      description: 'plan-only | plan-first | execute | validate',
      default: 'plan-first',
    },
    task: {
      type: 'string',
      description: 'Optional task description scoped to this DevCycle.',
    },
    autoExecute: {
      type: 'boolean',
      description: 'Override to force implementation after planning.',
      default: false,
    },
  },
  tools: ['filesystem/*', 'memory/*', 'sequentialthinking/*', 'runTests', 'todos', 'runSubagent'],
});

const MAX_SNIPPET_LENGTH = 4000;

function snippet(value) {
  return (value || '').slice(0, MAX_SNIPPET_LENGTH);
}

const phaseKey = (env.vars.phase || '').toLowerCase();
if (!phaseKey) {
  throw new Error('Phase runner requires `phase` input (e.g., scaffolding).');
}

const manifest = await loadManifest();
const entry = manifest[phaseKey];
if (!entry) {
  throw new Error(`Phase '${phaseKey}' is not defined in devcycles.config.json.`);
}

const instructionsPath = resolveFromGenai(entry.instructions);
const promptPath = resolveFromGenai(entry.prompt);
const toolsetPath = resolveFromGenai(entry.toolset);

const [instructionsText, promptTemplate, toolsetText, coreDocs] = await Promise.all([
  readFile(instructionsPath, 'utf8'),
  readFile(promptPath, 'utf8'),
  readFile(toolsetPath, 'utf8'),
  loadCoreDocuments(),
]);

const additionalContexts = [];
for (const relativePath of entry.contexts || []) {
  const resolved = resolveFromGenai(relativePath);
  const contents = await readOptional(resolved);
  if (contents) {
    additionalContexts.push({ path: relativePath, contents });
  }
}

const modeParam = (env.vars.mode || entry.defaultMode || 'plan-first').toLowerCase();
const shouldExecute =
  env.vars.autoExecute === 'true' || modeParam === 'execute' || modeParam === 'validate';
const focusTask = env.vars.task || 'Execute the standard DevCycle scope.';

const planResponse = await runPrompt((_) => {
  _.system.text(
    'You are the Loaded Vibes automation engine. Follow Spec-Driven Workflow (Analyze → Design → Implement → Validate → Reflect/Handoff).'
  );
  _.system.text(
    `DevCycle: ${entry.label}. Mode: ${modeParam}. Checkpoints: ${
      entry.checkpoints?.join(', ') || 'analyze, design, implement, validate, handoff'
    }.`
  );
  _.user.text('## DevCycle Instructions\n' + snippet(instructionsText));
  _.user.text('## Prompt Template\n' + snippet(promptTemplate));
  _.user.text('## Toolset Definition\n' + snippet(toolsetText));
  _.user.text('## Core Documents Snapshot\n' + snippet(coreDocs.prd));
  _.user.text('## Technical Requirements Snapshot\n' + snippet(coreDocs.tech));
  if (coreDocs.todo) {
    _.user.text('## TODO.md Snapshot\n' + snippet(coreDocs.todo));
  }
  if (coreDocs.changelog) {
    _.user.text('## CHANGELOG.md Snapshot\n' + snippet(coreDocs.changelog));
  }
  for (const ctx of additionalContexts) {
    _.user.text(`## Context: ${ctx.path}\n${snippet(ctx.contents)}`);
  }
  _.user.text(
    `## Task\nFocus Task: ${focusTask}. Respond with JSON {"requirements":[],"plan":[],"risks":[],"approvals":[],"citations":[]}.`
  );
});

let parsedPlan;
try {
  parsedPlan = JSON.parse(planResponse.text);
} catch (error) {
  parsedPlan = null;
}

console.log('📋 DevCycle Plan Generated:');
console.log(parsedPlan || planResponse.text);

if (!shouldExecute) {
  console.log(
    'Mode is plan-first/plan-only. Review the plan, obtain approval, then rerun with --mode execute to apply changes.'
  );
} else {
  const implementationResponse = await runPrompt((_) => {
    _.system.text(
      'Implementation step: derive concrete actions from the approved plan. Reference the toolset and cite PRD/TechReq paragraphs.'
    );
    _.user.text(
      `Plan JSON:\n${parsedPlan ? JSON.stringify(parsedPlan, null, 2) : planResponse.text}`
    );
    _.user.text('Instructions:\n' + instructionsText);
    _.user.text(
      'Return Markdown with sections: ##ImplementationSteps, ##FileOperations, ##ToolingCommands, ##RiskMitigations, ##ChangelogHooks.'
    );
  });

  console.log('🛠 Implementation Guidance:');
  console.log(implementationResponse.text);

  if (modeParam === 'validate') {
    const validationResponse = await runPrompt((_) => {
      _.system.text('Validation step: list tests, manual checks, and acceptance evidence.');
      _.user.text('Re-use the plan + implementation summaries.');
      _.user.text(
        'Respond with ##AutomatedTests, ##ManualChecks, ##AcceptanceCriteria, ##FollowUps. Reference toolset commands for each test.'
      );
    });
    console.log('✅ Validation Guidance:');
    console.log(validationResponse.text);
  }
}
