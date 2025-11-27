/**
 * Loaded Vibes Orchestrator
 *
 * Coordinates DevCycles by pairing manifest metadata with the general phase
 * runner, enforcing Spec-Driven Workflow gates.
 *
 * Context Hydration (SPEC-ENGINE §4):
 * Before invoking any DevCycle phase, the orchestrator hydrates context with:
 * - prdContent: Full PRD.md document
 * - techRequirementsContent: Full TECH_REQUIREMENTS.md document
 * - todoEntries: TODO.md content for tracking work items
 * - changelogEntries: CHANGELOG.md content for decision/update history
 * - stateSnapshot: Current orchestrator state from state.json
 *
 * The hydrated context is attached to env.vars.context and made available
 * to all phase runners for consistent access to project documentation.
 *
 * @see TECH_REQUIREMENTS §4.2, SPEC-ENGINE §4
 */

import { loadManifest, loadCoreDocuments, loadState, saveState } from './shared/context.js';
import {
  loadPRD,
  loadTechRequirements,
  loadTODO,
  loadChangelog,
  clearContextCache,
} from './shared/contextLoader.js';
import {
  loadState as loadStateSync,
  clearStateCache,
} from './shared/statePersistence.js';

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

/**
 * Context Hydration (SPEC-ENGINE §4)
 *
 * Before invoking any DevCycle phase, hydrate context with:
 * - prdContent: PRD.md document
 * - techRequirementsContent: TECH_REQUIREMENTS.md document
 * - todoEntries: TODO.md content
 * - changelogEntries: CHANGELOG.md content
 * - stateSnapshot: Current state from state.json
 *
 * This context is attached to env.vars.context and passed to phase runners.
 * @see TECH_REQUIREMENTS §4.2
 */

// Clear caches to ensure fresh context reads per SPEC-ENGINE §4
clearContextCache();
clearStateCache();

// Hydrate context from core documents using shared utilities
const prdContent = loadPRD();
const techRequirementsContent = loadTechRequirements();
const todoEntries = loadTODO();
const changelogEntries = loadChangelog();
const stateSnapshot = loadStateSync();

// Also load async documents for compatibility
const docs = await loadCoreDocuments();

// Attach hydrated context to env.vars for phase runner access
const hydratedContext = {
  prdContent,
  techRequirementsContent,
  todoEntries,
  changelogEntries,
  stateSnapshot,
  // Expose key metadata for quick reference
  devCycleId: normalizedPhaseInput,
  devCycleLabel: selectedEntry.label,
  checkpoints: selectedEntry.checkpoints,
  mode: modeParam,
  timestamp: new Date().toISOString(),
};

// Attach to env.vars.context for all phases to access
env.vars.context = hydratedContext;

console.log('📚 Context Hydrated for DevCycle (SPEC-ENGINE §4)', selectedEntry.label);
console.log({
  phase: normalizedPhaseInput,
  mode: modeParam,
  task: env.vars.task || 'standard-scope',
  checkpoints: selectedEntry.checkpoints,
  prdLoaded: !!prdContent,
  prdLength: prdContent.length,
  techRequirementsLoaded: !!techRequirementsContent,
  techRequirementsLength: techRequirementsContent.length,
  todoLoaded: !!todoEntries,
  todoLength: todoEntries.length,
  changelogLoaded: !!changelogEntries,
  changelogLength: changelogEntries.length,
  stateRestored: !!stateSnapshot,
  completedPhases: stateSnapshot?.completedPhases?.length || 0,
  prdExcerpt: prdContent?.slice(0, 400),
  techExcerpt: techRequirementsContent?.slice(0, 400),
});

await runPromptWithVars('./phases/scaffolding.genai.js', {
  phase: normalizedPhaseInput,
  mode: modeParam,
  autoExecute: modeParam === 'execute' || modeParam === 'validate' ? 'true' : 'false',
  context: hydratedContext,
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

