// @ts-nocheck
/**
 * State Persistence Utility
 *
 * Provides synchronous, memoized access to orchestrator state
 * stored in `dist/genaiscript/state/state.json`. Handles state
 * loading, saving, and history management for DevCycle tracking.
 *
 * @module statePersistence
 * @see PRD §5, TECH_REQUIREMENTS §4.5, SPEC-ARCH §1.2
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const STATE_DIR = path.resolve(GENAI_ROOT, 'state');
const STATE_PATH = path.resolve(STATE_DIR, 'state.json');

/** @type {object|null} */
let stateCache = null;

/**
 * @typedef {Object} HistoryEntry
 * @property {string} phase - DevCycle phase name
 * @property {string} mode - Execution mode (plan-only, execute, validate)
 * @property {string|null} task - Task description or null
 * @property {string} timestamp - ISO 8601 timestamp
 */

/**
 * @typedef {Object} ExecutionTimestamps
 * @property {string} startTime - ISO 8601 start timestamp
 * @property {string|null} endTime - ISO 8601 end timestamp
 * @property {number|null} durationMs - Duration in milliseconds
 */

/**
 * @typedef {Object} ExecutionSnapshot
 * @property {string} phase - DevCycle phase name
 * @property {Object} params - Execution parameters (mode, task, skipBootstrap, etc.)
 * @property {Object} outputs - Phase outputs and artifacts
 * @property {ExecutionTimestamps} timestamps - Phase timing information
 * @property {'pending'|'running'|'complete'|'failed'|'blocked'} status - Execution status
 * @property {string|null} errorMessage - Error message if failed
 * @see TECH §4.5, SPEC-ENGINE §5
 */

/**
 * @typedef {Object} OrchestratorState
 * @property {string|null} lastPhase - Last completed phase
 * @property {string|null} nextPhase - Next recommended phase
 * @property {string[]} completedPhases - Array of completed phase names
 * @property {HistoryEntry[]} history - Execution history entries
 * @property {ExecutionSnapshot[]} executionSnapshots - Phase execution snapshots for resume
 * @property {string|null} lastUpdated - Last state update timestamp
 */

/**
 * Returns the default/empty state object.
 *
 * @returns {OrchestratorState}
 */
export function getDefaultState() {
  return {
    lastPhase: null,
    nextPhase: null,
    completedPhases: [],
    history: [],
    executionSnapshots: [],
    lastUpdated: null,
  };
}

/**
 * Clears the state cache. Call this when state may have been
 * modified externally and you need a fresh read.
 *
 * @returns {void}
 */
export function clearStateCache() {
  stateCache = null;
}

/**
 * Loads the orchestrator state synchronously with memoization.
 * Returns default state if file does not exist or is invalid.
 * Implements restoration logic with fallback if corrupt (SPEC-ENGINE §5).
 *
 * @returns {OrchestratorState}
 */
export function loadState() {
  if (stateCache !== null) {
    return stateCache;
  }

  if (!existsSync(STATE_PATH)) {
    stateCache = getDefaultState();
    return stateCache;
  }

  try {
    const raw = readFileSync(STATE_PATH, 'utf8');
    const parsed = JSON.parse(raw);

    // Validate and migrate state structure (SPEC-ENGINE §5)
    stateCache = {
      lastPhase: parsed.lastPhase ?? null,
      nextPhase: parsed.nextPhase ?? null,
      completedPhases: Array.isArray(parsed.completedPhases) ? parsed.completedPhases : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      executionSnapshots: Array.isArray(parsed.executionSnapshots) ? parsed.executionSnapshots : [],
      lastUpdated: parsed.lastUpdated ?? null,
    };
  } catch (error) {
    // Fallback to default state if corrupt (SPEC-ENGINE §5)
    console.warn('⚠️  State file corrupt, falling back to default state:', error.message);
    stateCache = getDefaultState();
  }

  return stateCache;
}

/**
 * Saves the orchestrator state synchronously.
 * Creates the state directory if it does not exist.
 * Adds lastUpdated timestamp for tracking (TECH §4.5).
 *
 * @param {OrchestratorState} state - State object to save
 * @returns {void}
 */
export function saveState(state) {
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }

  // Ensure lastUpdated is set (TECH §4.5)
  const stateWithTimestamp = {
    ...state,
    lastUpdated: new Date().toISOString(),
  };

  const serialized = JSON.stringify(stateWithTimestamp, null, 2);
  writeFileSync(STATE_PATH, serialized, 'utf8');
  stateCache = stateWithTimestamp;
}

/**
 * Updates the state with a new history entry and saves it.
 *
 * @param {string} phase - Phase name
 * @param {string} mode - Execution mode
 * @param {string|null} task - Optional task description
 * @param {string|null} nextPhase - Next recommended phase
 * @returns {OrchestratorState} Updated state
 */
export function recordPhaseExecution(phase, mode, task = null, nextPhase = null) {
  const current = loadState();

  /** @type {HistoryEntry} */
  const entry = {
    phase,
    mode,
    task,
    timestamp: new Date().toISOString(),
  };

  const completedPhases = Array.from(
    new Set([...current.completedPhases, phase])
  );

  const updated = {
    ...current,
    lastPhase: phase,
    nextPhase: nextPhase,
    completedPhases,
    history: [...current.history, entry],
  };

  saveState(updated);
  return updated;
}

/**
 * Checks if a phase has been completed.
 *
 * @param {string} phase - Phase name to check
 * @returns {boolean}
 */
export function isPhaseCompleted(phase) {
  const state = loadState();
  return state.completedPhases.includes(phase);
}

/**
 * Gets the last N history entries.
 *
 * @param {number} [count=10] - Number of entries to retrieve
 * @returns {HistoryEntry[]}
 */
export function getRecentHistory(count = 10) {
  const state = loadState();
  const history = state.history || [];
  return history.slice(-count);
}

/**
 * Resets the state to default values. Use with caution.
 *
 * @returns {OrchestratorState}
 */
export function resetState() {
  const defaultState = getDefaultState();
  saveState(defaultState);
  return defaultState;
}

// ============================================================================
// Execution Snapshot Management (TECH §4.5, SPEC-ENGINE §5)
// ============================================================================

/**
 * Creates a new execution snapshot for a phase.
 *
 * @param {string} phase - Phase name
 * @param {Object} params - Execution parameters (mode, task, etc.)
 * @returns {ExecutionSnapshot}
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function createExecutionSnapshot(phase, params = {}) {
  return {
    phase,
    params: { ...params },
    outputs: {},
    timestamps: {
      startTime: new Date().toISOString(),
      endTime: null,
      durationMs: null,
    },
    status: 'running',
    errorMessage: null,
  };
}

/**
 * Starts a new phase execution and persists the snapshot.
 * Returns the snapshot for tracking during execution.
 *
 * @param {string} phase - Phase name
 * @param {Object} params - Execution parameters
 * @returns {ExecutionSnapshot} The created snapshot
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function startPhaseExecution(phase, params = {}) {
  const current = loadState();
  const snapshot = createExecutionSnapshot(phase, params);

  // Add to snapshots array
  const executionSnapshots = [...(current.executionSnapshots || []), snapshot];

  const updated = {
    ...current,
    executionSnapshots,
  };

  saveState(updated);
  return snapshot;
}

/**
 * Completes a phase execution and updates the snapshot with outputs.
 *
 * @param {string} phase - Phase name
 * @param {Object} outputs - Phase outputs and artifacts
 * @param {'complete'|'failed'|'blocked'} status - Final status
 * @param {string|null} errorMessage - Error message if failed
 * @returns {ExecutionSnapshot|null} Updated snapshot or null if not found
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function completePhaseExecution(phase, outputs = {}, status = 'complete', errorMessage = null) {
  const current = loadState();
  const snapshots = current.executionSnapshots || [];

  // Find the most recent running snapshot for this phase (backwards compatible)
  let snapshotIndex = -1;
  for (let i = snapshots.length - 1; i >= 0; i--) {
    if (snapshots[i].phase === phase && snapshots[i].status === 'running') {
      snapshotIndex = i;
      break;
    }
  }

  if (snapshotIndex === -1) {
    console.warn(`⚠️  No running snapshot found for phase: ${phase}`);
    return null;
  }

  const snapshot = snapshots[snapshotIndex];
  const endTime = new Date().toISOString();
  const startTime = new Date(snapshot.timestamps.startTime);
  const durationMs = new Date(endTime).getTime() - startTime.getTime();

  // Update the snapshot
  const updatedSnapshot = {
    ...snapshot,
    outputs: { ...outputs },
    timestamps: {
      ...snapshot.timestamps,
      endTime,
      durationMs,
    },
    status,
    errorMessage,
  };

  // Replace in array
  const updatedSnapshots = [...snapshots];
  updatedSnapshots[snapshotIndex] = updatedSnapshot;

  const updated = {
    ...current,
    executionSnapshots: updatedSnapshots,
  };

  saveState(updated);
  return updatedSnapshot;
}

/**
 * Gets the most recent execution snapshot for a phase.
 *
 * @param {string} phase - Phase name
 * @returns {ExecutionSnapshot|null}
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function getLatestSnapshot(phase) {
  const state = loadState();
  const snapshots = state.executionSnapshots || [];

  for (let i = snapshots.length - 1; i >= 0; i--) {
    if (snapshots[i].phase === phase) {
      return snapshots[i];
    }
  }

  return null;
}

/**
 * Gets all execution snapshots for a phase.
 *
 * @param {string} phase - Phase name
 * @returns {ExecutionSnapshot[]}
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function getPhaseSnapshots(phase) {
  const state = loadState();
  const snapshots = state.executionSnapshots || [];
  return snapshots.filter((s) => s.phase === phase);
}

/**
 * Gets execution snapshots that can be resumed (running status).
 *
 * @returns {ExecutionSnapshot[]}
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function getResumableSnapshots() {
  const state = loadState();
  const snapshots = state.executionSnapshots || [];
  return snapshots.filter((s) => s.status === 'running');
}

/**
 * Checks if there are any phases that can be resumed.
 *
 * @returns {boolean}
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function hasResumablePhases() {
  return getResumableSnapshots().length > 0;
}

/**
 * Cleans up old execution snapshots, keeping only the last N per phase.
 *
 * @param {number} [keepPerPhase=5] - Number of snapshots to keep per phase
 * @returns {number} Number of snapshots removed
 * @see TECH §4.5
 */
export function cleanupOldSnapshots(keepPerPhase = 5) {
  const current = loadState();
  const snapshots = current.executionSnapshots || [];

  // Group by phase
  const byPhase = {};
  for (const snapshot of snapshots) {
    if (!byPhase[snapshot.phase]) {
      byPhase[snapshot.phase] = [];
    }
    byPhase[snapshot.phase].push(snapshot);
  }

  // Keep only the last N per phase
  const kept = [];
  for (const phase of Object.keys(byPhase)) {
    const phaseSnapshots = byPhase[phase];
    kept.push(...phaseSnapshots.slice(-keepPerPhase));
  }

  const removed = snapshots.length - kept.length;

  if (removed > 0) {
    const updated = {
      ...current,
      executionSnapshots: kept,
    };
    saveState(updated);
  }

  return removed;
}

/** Exported paths for external use */
export { STATE_DIR, STATE_PATH };
