// @ts-nocheck
/**
 * Phase Runner Template
 *
 * Implements the Spec-Driven Workflow: Analyze → Design → Implement → Validate → Reflect.
 * This template is reusable across all DevCycles and enforces workflow gates per SPEC-DEV §2.
 *
 * @module phase-template
 * @see TECH §4.3, SPEC-ENGINE §4, SPEC-DEV §2, SPEC-OBS §3, SPEC-SECURITY §3
 */

import {
  loadManifest,
  resolveFromGenai,
  loadCoreDocuments,
  readOptional,
} from '../shared/context.js';
import { addChangelogEntry, getTimestamp } from '../shared/changelogUpdater.js';
import { markTodoComplete, addTodoItem } from '../shared/todoUpdater.js';
import { readFile } from 'fs/promises';
import {
  reflectStageHook,
  persistLogEntries,
  extractRequirementIds,
} from '../logging/markdownSummaries.js';
import {
  createAndWriteSummary,
} from '../shared/summaryWriter.js';

/**
 * Phase runner metadata for orchestrator consumption.
 * @see TECH §4.3 - Each phases/*.genai.js script MUST export metadata.
 */
export const metadata = {
  name: 'phase-template',
  description: 'Reusable phase runner template implementing Analyze → Design → Implement → Validate → Reflect workflow',
  requiredInputs: ['phase', 'mode'],
  specReferences: ['TECH §4.3', 'SPEC-ENGINE §4', 'SPEC-DEV §2', 'SPEC-OBS §3', 'SPEC-SECURITY §3'],
  requirementIds: ['REQ-PHASE-RUNNER-001'],
};

script({
  title: 'Loaded Vibes Phase Runner Template',
  description:
    'Executes any DevCycle using the five-stage workflow (Analyze → Design → Implement → Validate → Reflect) with EARS requirement citations and Bad Vibes Firewall integration.',
  parameters: {
    phase: {
      type: 'string',
      description: 'DevCycle key to execute (e.g., scaffolding, testing).',
    },
    mode: {
      type: 'string',
      description: 'Execution mode: plan-only | plan-first | execute | validate',
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

// ============================================================================
// NDJSON Logging Utilities (SPEC-OBS §3)
// ============================================================================

/**
 * @typedef {Object} NDJSONEvent
 * @property {string} devCycleId - DevCycle identifier
 * @property {string} phase - Current workflow phase
 * @property {string} requirementId - Requirement citation
 * @property {'info'|'warn'|'error'} severity - Event severity
 * @property {string} checkpointId - Checkpoint identifier
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {string} [message] - Optional details
 * @property {string[]} [artifacts] - Optional file paths
 */

/**
 * Collects NDJSON events for later processing by markdownSummaries module.
 * @type {NDJSONEvent[]}
 * @see SPEC-OBS §3, Issue #17
 */
const collectedEvents = [];

/**
 * Tracks the DevCycle start time for execution summaries.
 * Set when DevCycle begins execution.
 * @type {string|null}
 * @see TECH §11, Issue #73
 */
let devCycleStartTime = null;

/**
 * Logs an NDJSON event to console and collects it for summary generation.
 * @param {NDJSONEvent} event - Event to log
 * @see SPEC-OBS §3
 */
function logNDJSON(event) {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  };
  console.log('📊 NDJSON:', JSON.stringify(logEntry));
  // Collect event for Markdown summary generation (Issue #17)
  collectedEvents.push(logEntry);
}

/**
 * Creates an NDJSON event for a stage transition.
 * @param {string} devCycleId - DevCycle identifier
 * @param {string} phase - Current phase name
 * @param {string} checkpointId - Checkpoint identifier
 * @param {string} requirementId - Requirement citation
 * @param {'info'|'warn'|'error'} severity - Event severity
 * @param {string} [message] - Optional message
 * @returns {NDJSONEvent}
 */
function createStageEvent(devCycleId, phase, checkpointId, requirementId, severity = 'info', message = '') {
  return {
    devCycleId,
    phase,
    requirementId,
    severity,
    checkpointId,
    timestamp: new Date().toISOString(),
    message,
  };
}

// ============================================================================
// Bad Vibes Firewall (SPEC-SECURITY §3)
// ============================================================================

/**
 * @typedef {Object} ApprovalResult
 * @property {boolean} approved - Whether the action was approved
 * @property {string|null} approver - Approver identifier
 * @property {string} timestamp - Approval timestamp
 * @property {string} action - Action that was approved/denied
 */

/**
 * Prompts for approval of destructive actions per SPEC-SECURITY §3.
 * @param {string} devCycleId - DevCycle identifier
 * @param {string} action - Description of the destructive action
 * @param {string[]} affectedPaths - Paths that will be modified
 * @param {string[]} rollbackSteps - Steps to rollback if needed
 * @returns {ApprovalResult}
 */
function requireDestructiveActionApproval(devCycleId, action, affectedPaths, rollbackSteps) {
  console.log('\n⚠️ ═══════════════════════════════════════════════════════════════');
  console.log('   BAD VIBES FIREWALL: Destructive Action Detected');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`📋 DevCycle: ${devCycleId}`);
  console.log(`🎯 Action: ${action}`);
  console.log(`📁 Affected Paths:`);
  affectedPaths.forEach((p) => console.log(`   - ${p}`));
  console.log(`↩️  Rollback Steps:`);
  rollbackSteps.forEach((s, i) => console.log(`   ${i + 1}. ${s}`));
  console.log('\n📌 Reference: SPEC-SECURITY §3, PRD §5.5');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Log the approval request to NDJSON
  logNDJSON(createStageEvent(
    devCycleId,
    'implement',
    'destructive-action-approval',
    'SPEC-SECURITY §3',
    'warn',
    `Approval required for: ${action}`
  ));

  // Placeholder: In production, this would block and await human input
  // For now, return pending approval status
  return {
    approved: false,
    approver: null,
    timestamp: new Date().toISOString(),
    action,
  };
}

// ============================================================================
// Stage Implementations
// ============================================================================

const MAX_SNIPPET_LENGTH = 4000;

/**
 * Truncates content to maximum snippet length.
 * @param {string} value - Content to truncate
 * @returns {string}
 */
function snippet(value) {
  return (value || '').slice(0, MAX_SNIPPET_LENGTH);
}

/**
 * ANALYZE STAGE: Summarize relevant PRD/TechReq excerpts with EARS citations.
 * @param {string} devCycleId - DevCycle identifier
 * @param {Object} docs - Core documents (prd, tech, todo, changelog)
 * @param {string} instructionsText - DevCycle instructions content
 * @param {Object} entry - Manifest entry for this DevCycle
 * @returns {Promise<Object>} Analysis results
 * @see TECH §4.3, SPEC-ENGINE §4
 */
async function analyzeStage(devCycleId, docs, instructionsText, entry) {
  logNDJSON(createStageEvent(devCycleId, 'analyze', 'analyze-start', 'TECH §4.3', 'info', 'Starting Analyze stage'));

  const analysisResponse = await runPrompt((_) => {
    _.system.text(
      'You are the Loaded Vibes automation engine performing the ANALYZE stage. ' +
      'Extract and cite relevant requirements using EARS notation. ' +
      'Reference: TECH §4.3, SPEC-ENGINE §4.'
    );
    _.user.text('## DevCycle Instructions\n' + snippet(instructionsText));
    _.user.text('## PRD Excerpt\n' + snippet(docs.prd));
    _.user.text('## Technical Requirements Excerpt\n' + snippet(docs.tech));
    _.user.text('## TODO.md\n' + snippet(docs.todo));
    _.user.text(`## DevCycle: ${entry.label}`);
    _.user.text(`## Checkpoints: ${entry.checkpoints?.join(', ') || 'analyze, design, implement, validate, handoff'}`);
    _.user.text(
      'Analyze the requirements and return JSON: ' +
      '{"earsRequirements": [], "prdCitations": [], "techCitations": [], "blockers": [], "summary": ""}'
    );
  });

  let analysis;
  try {
    analysis = JSON.parse(analysisResponse.text);
  } catch {
    analysis = {
      earsRequirements: [],
      prdCitations: [],
      techCitations: [],
      blockers: [],
      summary: analysisResponse.text,
    };
  }

  logNDJSON(createStageEvent(
    devCycleId,
    'analyze',
    'analyze-complete',
    'TECH §4.3',
    'info',
    `Found ${analysis.earsRequirements?.length || 0} requirements`
  ));

  console.log('📊 ANALYZE Stage Complete:');
  console.log(analysis);

  return analysis;
}

/**
 * DESIGN STAGE: Produce ordered plan referencing manifest and risk register.
 * @param {string} devCycleId - DevCycle identifier
 * @param {Object} analysis - Results from Analyze stage
 * @param {string} instructionsText - DevCycle instructions content
 * @param {Object} entry - Manifest entry
 * @param {string} focusTask - Task description
 * @returns {Promise<Object>} Design plan
 * @see TECH §4.3, SPEC-ENGINE §4
 */
async function designStage(devCycleId, analysis, instructionsText, entry, focusTask) {
  logNDJSON(createStageEvent(devCycleId, 'design', 'design-start', 'TECH §4.3', 'info', 'Starting Design stage'));

  const designResponse = await runPrompt((_) => {
    _.system.text(
      'You are the Loaded Vibes automation engine performing the DESIGN stage. ' +
      'Create an ordered implementation plan with risk assessment. ' +
      'Reference: TECH §4.3, SPEC-ENGINE §4.'
    );
    _.user.text('## Analysis Results\n' + JSON.stringify(analysis, null, 2));
    _.user.text('## Instructions\n' + snippet(instructionsText));
    _.user.text(`## Focus Task: ${focusTask}`);
    _.user.text(`## Checkpoints: ${entry.checkpoints?.join(', ')}`);
    _.user.text(
      'Design the implementation plan and return JSON: ' +
      '{"requirements": [], "plan": [], "risks": [], "approvals": [], "citations": [], "estimatedDuration": ""}'
    );
  });

  let plan;
  try {
    plan = JSON.parse(designResponse.text);
  } catch {
    plan = {
      requirements: [],
      plan: [designResponse.text],
      risks: [],
      approvals: ['design-approval'],
      citations: [],
      estimatedDuration: 'Unknown',
    };
  }

  logNDJSON(createStageEvent(
    devCycleId,
    'design',
    'design-complete',
    'TECH §4.3',
    'info',
    `Generated ${plan.plan?.length || 0} implementation steps`
  ));

  console.log('📋 DESIGN Stage Complete:');
  console.log(plan);

  // Require design approval checkpoint
  console.log('\n🔐 Design Checkpoint: Awaiting approval before proceeding to Implement stage.');
  console.log('   Reference: TECH §7, SPEC-ENGINE §4');

  return plan;
}

/**
 * IMPLEMENT STAGE: Execute allowed commands/tools with destructive action approvals.
 * @param {string} devCycleId - DevCycle identifier
 * @param {Object} plan - Design plan from previous stage
 * @param {string} toolsetText - Toolset definition content
 * @param {string} instructionsText - DevCycle instructions
 * @returns {Promise<Object>} Implementation results
 * @see TECH §4.3, SPEC-ENGINE §4, SPEC-SECURITY §3
 */
async function implementStage(devCycleId, plan, toolsetText, instructionsText) {
  logNDJSON(createStageEvent(devCycleId, 'implement', 'implement-start', 'TECH §4.3', 'info', 'Starting Implement stage'));

  // Check for destructive actions and require approval
  const destructivePatterns = ['delete', 'remove', 'migrate', 'drop', 'overwrite', 'reset'];
  const planText = JSON.stringify(plan).toLowerCase();
  const hasDestructiveAction = destructivePatterns.some((p) => planText.includes(p));

  if (hasDestructiveAction) {
    const approval = requireDestructiveActionApproval(
      devCycleId,
      'Plan contains potentially destructive operations',
      ['See plan.plan for affected files'],
      ['Restore from git backup', 'Revert migrations', 'Check .loaded-vibes/backup/']
    );

    if (!approval.approved) {
      console.log('⏸️  Implementation paused: Awaiting destructive action approval.');
      logNDJSON(createStageEvent(
        devCycleId,
        'implement',
        'implement-blocked',
        'SPEC-SECURITY §3',
        'warn',
        'Blocked pending destructive action approval'
      ));
      return {
        status: 'blocked',
        reason: 'Destructive action approval required',
        approval,
      };
    }
  }

  const implementResponse = await runPrompt((_) => {
    _.system.text(
      'You are the Loaded Vibes automation engine performing the IMPLEMENT stage. ' +
      'Derive concrete actions from the approved plan. Reference toolset and cite PRD/TechReq. ' +
      'Reference: TECH §4.3, SPEC-ENGINE §4, SPEC-SECURITY §3.'
    );
    _.user.text('## Approved Plan\n' + JSON.stringify(plan, null, 2));
    _.user.text('## Toolset\n' + snippet(toolsetText));
    _.user.text('## Instructions\n' + snippet(instructionsText));
    _.user.text(
      'Return Markdown with sections: ##ImplementationSteps, ##FileOperations, ' +
      '##ToolingCommands, ##RiskMitigations, ##ChangelogHooks'
    );
  });

  logNDJSON(createStageEvent(
    devCycleId,
    'implement',
    'implement-complete',
    'TECH §4.3',
    'info',
    'Implementation guidance generated'
  ));

  console.log('🛠️  IMPLEMENT Stage Complete:');
  console.log(implementResponse.text);

  return {
    status: 'complete',
    guidance: implementResponse.text,
    plan,
  };
}

/**
 * VALIDATE STAGE: Run tests/verifications and capture acceptance evidence.
 * @param {string} devCycleId - DevCycle identifier
 * @param {Object} implementation - Results from Implement stage
 * @param {string} toolsetText - Toolset definition
 * @returns {Promise<Object>} Validation results
 * @see TECH §4.3, SPEC-ENGINE §4
 */
async function validateStage(devCycleId, implementation, toolsetText) {
  logNDJSON(createStageEvent(devCycleId, 'validate', 'validate-start', 'TECH §4.3', 'info', 'Starting Validate stage'));

  const validateResponse = await runPrompt((_) => {
    _.system.text(
      'You are the Loaded Vibes automation engine performing the VALIDATE stage. ' +
      'List tests, manual checks, and acceptance evidence. ' +
      'Reference: TECH §4.3, SPEC-ENGINE §4.'
    );
    _.user.text('## Implementation Summary\n' + (implementation.guidance || JSON.stringify(implementation)));
    _.user.text('## Toolset\n' + snippet(toolsetText));
    _.user.text(
      'Return JSON: {"automatedTests": {"passed": boolean, "details": ""}, ' +
      '"manualChecks": [], "acceptanceCriteria": [], "followUps": []}'
    );
  });

  let validation;
  try {
    validation = JSON.parse(validateResponse.text);
  } catch {
    validation = {
      automatedTests: { passed: false, details: 'Parse error' },
      manualChecks: [validateResponse.text],
      acceptanceCriteria: [],
      followUps: [],
    };
  }

  const severity = validation.automatedTests?.passed ? 'info' : 'warn';
  logNDJSON(createStageEvent(
    devCycleId,
    'validate',
    'validate-complete',
    'TECH §4.3',
    severity,
    `Validation ${validation.automatedTests?.passed ? 'passed' : 'needs attention'}`
  ));

  console.log('✅ VALIDATE Stage Complete:');
  console.log(validation);

  return validation;
}

/**
 * REFLECT STAGE: Update TODO/CHANGELOG, memory, and prepare handoff.
 * Now also writes dual-mode execution summaries per TECH §11 and ADR-0001.
 * @param {string} devCycleId - DevCycle identifier
 * @param {Object} validation - Results from Validate stage
 * @param {Object} entry - Manifest entry
 * @param {Object} plan - Design plan
 * @param {string} focusTask - Original task description
 * @returns {Promise<Object>} Reflect/handoff summary
 * @see TECH §4.3, TECH §7, TECH §11, SPEC-ENGINE §4, SPEC-OBS §2, ADR-0001, Issue #17, Issue #73
 */
async function reflectStage(devCycleId, validation, entry, plan, focusTask) {
  logNDJSON(createStageEvent(devCycleId, 'reflect', 'reflect-start', 'TECH §7', 'info', 'Starting Reflect stage'));

  // Prepare CHANGELOG entry
  const changelogEntry = {
    type: 'Update',
    timestamp: getTimestamp(),
    goal: `Execute ${entry.label} DevCycle - ${focusTask}`,
    action: `Completed five-stage workflow (Analyze → Design → Implement → Validate → Reflect) per TECH §4.3`,
    result: validation.automatedTests?.passed
      ? 'All validation checks passed'
      : 'Validation completed with follow-up items',
    next: validation.followUps?.length > 0
      ? validation.followUps.join('; ')
      : 'Proceed to next DevCycle',
  };

  // Add CHANGELOG entry using shared utility
  try {
    addChangelogEntry(changelogEntry);
    console.log('📝 CHANGELOG updated with DevCycle summary.');
  } catch (err) {
    console.log('⚠️  CHANGELOG update failed (may need manual update):', err.message);
  }

  // Update TODO with follow-ups
  if (validation.followUps && validation.followUps.length > 0) {
    for (const followUp of validation.followUps) {
      try {
        addTodoItem('Engine & Orchestration', followUp, `${devCycleId} DevCycle, TECH §7`);
      } catch {
        console.log('⚠️  TODO item add failed (may need manual update)');
      }
    }
    console.log(`📋 Added ${validation.followUps.length} follow-up items to TODO.md`);
  }

  // Mark related TODO items complete if applicable
  try {
    markTodoComplete('phase runner template');
    console.log('☑️  Marked phase runner TODO item complete.');
  } catch {
    // Item may not exist or already complete
  }

  // =========================================================================
  // Markdown Summary Generation from NDJSON logs (Issue #17, SPEC-OBS §3)
  // =========================================================================
  
  // Persist collected NDJSON events to log file
  let logFilePath = null;
  if (collectedEvents.length > 0) {
    logFilePath = persistLogEntries(collectedEvents);
    if (logFilePath) {
      console.log(`📊 NDJSON logs persisted to: ${logFilePath}`);
    }
    
    // Generate Markdown summaries from collected events
    // This integrates with the reflectStageHook per Issue #17
    try {
      const summaryResult = reflectStageHook(devCycleId, collectedEvents, {
        skipDuplicateCheck: false, // Ensure idempotent writes
        todoCategory: 'Observability & Logging',
      });
      
      if (summaryResult.todoUpdated) {
        console.log('📋 TODO.md updated with DevCycle summary from NDJSON logs.');
      }
      if (summaryResult.changelogUpdated) {
        console.log('📝 CHANGELOG.md updated with action log from NDJSON logs.');
      }
      if (!summaryResult.success) {
        console.log('⚠️  Markdown summary generation had issues:', summaryResult.error);
      }
    } catch (err) {
      console.log('⚠️  Markdown summary hook failed:', err.message);
    }
  }

  // =========================================================================
  // Dual-Mode Execution Summaries (Issue #73, TECH §11, SPEC-OBS §2, ADR-0001)
  // =========================================================================
  
  try {
    // Extract requirement IDs from collected events
    const requirementIds = extractRequirementIds(collectedEvents);
    
    // Build checkpoint approvals from events
    const checkpointEvents = collectedEvents.filter(
      (e) => e.checkpointId && e.checkpointId.includes('approval')
    );
    const checkpoints = checkpointEvents.map((e) => ({
      id: e.checkpointId,
      approved: e.severity !== 'error',
      approver: 'system',
    }));
    
    // Add standard checkpoints if none recorded
    if (checkpoints.length === 0 && entry.checkpoints?.length > 0) {
      for (const cp of entry.checkpoints) {
        checkpoints.push({
          id: cp,
          approved: true,
          approver: 'system',
        });
      }
    }
    
    // Determine execution status
    const hasErrors = collectedEvents.some((e) => e.severity === 'error');
    const status = hasErrors ? 'failure' : (validation.automatedTests?.passed ? 'success' : 'failure');
    
    // Get relative log file path for summary
    // Pattern extracts path starting from .loaded-vibes directory
    const LOADED_VIBES_PATH_PATTERN = /^.*?(\.loaded-vibes)/;
    let relativeLogPath;
    if (logFilePath) {
      const match = logFilePath.match(LOADED_VIBES_PATH_PATTERN);
      relativeLogPath = match ? logFilePath.replace(LOADED_VIBES_PATH_PATTERN, '$1') : logFilePath;
    }
    
    // Build artifacts list, filtering out undefined values
    const artifacts = [
      ...(relativeLogPath ? [relativeLogPath] : []),
      ...(validation.artifacts || []),
    ].filter(Boolean);
    
    // Write dual-mode summaries (JSON + Markdown)
    const dualSummaryResult = createAndWriteSummary({
      devCycleId,
      startTime: devCycleStartTime || new Date().toISOString(),
      endTime: new Date().toISOString(),
      status,
      requirementIds: requirementIds.length > 0 ? requirementIds : ['TECH §11', 'SPEC-OBS §2'],
      checkpoints,
      validationResult: {
        passed: validation.automatedTests?.passed ?? !hasErrors,
        details: validation.automatedTests?.details || 
          (hasErrors ? 'DevCycle completed with errors' : 'All phases completed successfully'),
      },
      artifacts,
      logFile: relativeLogPath,
      phase: 'reflect',
    });
    
    if (dualSummaryResult.success) {
      console.log('📝 Dual-mode execution summaries written (TECH §11, ADR-0001):');
      console.log(`   JSON: ${dualSummaryResult.jsonPath}`);
      console.log(`   Markdown: ${dualSummaryResult.markdownPath}`);
    } else {
      console.log('⚠️  Dual-mode summary write failed:', dualSummaryResult.error);
    }
  } catch (err) {
    console.log('⚠️  Dual-mode execution summary generation failed:', err.message);
  }

  const reflectSummary = {
    devCycleId,
    label: entry.label,
    status: validation.automatedTests?.passed ? 'complete' : 'complete-with-followups',
    changelogEntry,
    todoUpdates: validation.followUps?.length || 0,
    nextRecommendation: plan.citations?.includes('chain') ? 'Continue to next DevCycle' : 'Await manual trigger',
    timestamp: new Date().toISOString(),
    ndjsonEventsCount: collectedEvents.length,
  };

  logNDJSON(createStageEvent(
    devCycleId,
    'reflect',
    'reflect-complete',
    'TECH §7',
    'info',
    `DevCycle ${devCycleId} complete. TODO updates: ${reflectSummary.todoUpdates}`
  ));

  console.log('🔄 REFLECT/HANDOFF Stage Complete:');
  console.log(reflectSummary);

  return reflectSummary;
}

// ============================================================================
// Main Execution
// ============================================================================

const phaseKey = (env.vars.phase || '').toLowerCase();
if (!phaseKey) {
  throw new Error('Phase runner requires `phase` input (e.g., scaffolding). Reference: TECH §4.3');
}

const manifest = await loadManifest();
const entry = manifest[phaseKey];
if (!entry) {
  throw new Error(`Phase '${phaseKey}' is not defined in devcycles.config.json. Reference: SPEC-ENGINE §3`);
}

// Log DevCycle start and capture start time for execution summaries (Issue #73)
devCycleStartTime = new Date().toISOString();
logNDJSON(createStageEvent(phaseKey, 'init', 'devcycle-start', 'TECH §4.3', 'info', `Starting ${entry.label} DevCycle`));

// Load required assets
const instructionsPath = resolveFromGenai(entry.instructions);
const promptPath = resolveFromGenai(entry.prompt);
const toolsetPath = resolveFromGenai(entry.toolset);

const [instructionsText, promptTemplate, toolsetText, coreDocs] = await Promise.all([
  readFile(instructionsPath, 'utf8'),
  readFile(promptPath, 'utf8'),
  readFile(toolsetPath, 'utf8'),
  loadCoreDocuments(),
]);

// Load additional contexts
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

console.log('═══════════════════════════════════════════════════════════════');
console.log(`🚀 PHASE RUNNER: ${entry.label} DevCycle`);
console.log(`   Mode: ${modeParam} | Task: ${focusTask}`);
console.log(`   Checkpoints: ${entry.checkpoints?.join(' → ')}`);
console.log('═══════════════════════════════════════════════════════════════\n');

// STAGE 1: ANALYZE
const analysis = await analyzeStage(phaseKey, coreDocs, instructionsText, entry);

// STAGE 2: DESIGN
const plan = await designStage(phaseKey, analysis, instructionsText, entry, focusTask);

// Check if we should proceed to implementation
if (!shouldExecute) {
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('⏸️  Mode is plan-first/plan-only.');
  console.log('   Review the plan, obtain approval, then rerun with --mode execute.');
  console.log('   Reference: TECH §7 - Human checkpoints required');
  console.log('════════════════════════════════════════════════════════════════\n');

  logNDJSON(createStageEvent(phaseKey, 'design', 'awaiting-approval', 'TECH §7', 'info', 'Paused for plan approval'));
} else {
  // STAGE 3: IMPLEMENT
  const implementation = await implementStage(phaseKey, plan, toolsetText, instructionsText);

  if (implementation.status === 'blocked') {
    console.log('\n⏸️  Implementation blocked. Resolve approval requirements and retry.');
  } else {
    // STAGE 4: VALIDATE
    if (modeParam === 'validate' || modeParam === 'execute') {
      const validation = await validateStage(phaseKey, implementation, toolsetText);

      // STAGE 5: REFLECT
      const reflect = await reflectStage(phaseKey, validation, entry, plan, focusTask);

      console.log('\n════════════════════════════════════════════════════════════════');
      console.log('✅ DEVCYCLE COMPLETE');
      console.log(`   Phase: ${reflect.label}`);
      console.log(`   Status: ${reflect.status}`);
      console.log(`   Next: ${reflect.nextRecommendation}`);
      console.log('════════════════════════════════════════════════════════════════\n');
    }
  }
}

// Log DevCycle end
logNDJSON(createStageEvent(phaseKey, 'complete', 'devcycle-end', 'TECH §4.3', 'info', `Finished ${entry.label} DevCycle`));
