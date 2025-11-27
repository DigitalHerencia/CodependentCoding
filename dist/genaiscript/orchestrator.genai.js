import { loadManifest, loadCoreDocuments, loadState, saveState } from './shared/context.js';

script({
  title: 'Loaded Vibes Orchestrator',
  description:
    'Coordinates DevCycles by pairing manifest metadata with the general phase runner, enforcing Spec-Driven Workflow gates.',
  parameters: {
    phase: {
      type: 'string',
      description: 'Optional DevCycle key. Defaults to next uncompleted phase.',
    },
    task: {
      type: 'string',
      description: 'Task description or ticket reference scoped to this DevCycle.',
    },
    mode: {
      type: 'string',
      description: 'plan-only | plan-first | execute | validate',
      default: 'plan-first',
    },
    chainNext: {
      type: 'boolean',
      description: 'Automatically display the next DevCycle recommendation.',
      default: false,
    },
    skipBootstrap: {
      type: 'boolean',
      description: 'Skip bootstrap preflight checks (not recommended).',
      default: false,
    },
    profilePath: {
      type: 'string',
      description: 'Override VS Code profile path for bootstrap validation.',
    },
  },
  tools: ['filesystem/*', 'memory/*', 'sequentialthinking/*', 'runTests', 'runSubagent', 'todos'],
});

async function runPromptWithVars(generatorPath, vars, options) {
  const previousVars = { ...env.vars };
  Object.assign(env.vars, vars);
  try {
    return await runPrompt(generatorPath, options);
  } finally {
    for (const key of Object.keys(env.vars)) {
      delete env.vars[key];
    }
    Object.assign(env.vars, previousVars);
  }
}

const manifest = await loadManifest();
const phaseOrder = Object.keys(manifest);
if (phaseOrder.length === 0) {
  throw new Error('No DevCycles found in devcycles.config.json.');
}

const state = await loadState();
const normalizedPhaseInput = (
  env.vars.phase ||
  state.nextPhase ||
  state.lastPhase ||
  phaseOrder[0]
).toLowerCase();
const modeParam = (env.vars.mode || 'plan-first').toLowerCase();

if (!manifest[normalizedPhaseInput]) {
  throw new Error(
    `Invalid phase '${normalizedPhaseInput}'. Allowed values: ${phaseOrder.join(', ')}`
  );
}

const selectedEntry = manifest[normalizedPhaseInput];
const nextIndex = phaseOrder.indexOf(normalizedPhaseInput) + 1;
const nextPhase = phaseOrder[nextIndex] || null;

if (env.vars.skipBootstrap !== 'true') {
  await runPromptWithVars('../scripts/bootstrapper.genaiscript.ts', {
    phase: normalizedPhaseInput,
    preflightOnly: 'true',
    ...(env.vars.profilePath ? { profilePath: env.vars.profilePath } : {}),
  });
}

const docs = await loadCoreDocuments();
console.log('📚 Context Loaded for DevCycle', selectedEntry.label);
console.log({
  phase: normalizedPhaseInput,
  mode: modeParam,
  task: env.vars.task || 'standard-scope',
  checkpoints: selectedEntry.checkpoints,
  prdExcerpt: docs.prd?.slice(0, 400),
  techExcerpt: docs.tech?.slice(0, 400),
});

await runPromptWithVars('./phases/scaffolding.genai.js', {
  phase: normalizedPhaseInput,
  mode: modeParam,
  autoExecute: modeParam === 'execute' || modeParam === 'validate' ? 'true' : 'false',
  ...(env.vars.task ? { task: env.vars.task } : {}),
});

const updatedState = {
  lastPhase: normalizedPhaseInput,
  completedPhases: Array.from(new Set([...(state.completedPhases || []), normalizedPhaseInput])),
  history: [
    ...(state.history || []),
    {
      phase: normalizedPhaseInput,
      mode: modeParam,
      task: env.vars.task || null,
      timestamp: new Date().toISOString(),
    },
  ],
  nextPhase,
};

await saveState(updatedState);

console.log('✅ DevCycle complete.');
console.log({
  lastPhase: updatedState.lastPhase,
  nextPhase: updatedState.nextPhase,
  totalCompleted: updatedState.completedPhases.length,
});

if (env.vars.chainNext === 'true' && nextPhase) {
  console.log(`🔁 Next recommended DevCycle: ${nextPhase}`);
  console.log(
    `Run: npx genaiscript run dist/genaiscript/orchestrator.genai.js --phase ${nextPhase}`
  );
}

