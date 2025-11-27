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
 * @typedef {Object} OrchestratorState
 * @property {string|null} lastPhase - Last completed phase
 * @property {string|null} nextPhase - Next recommended phase
 * @property {string[]} completedPhases - Array of completed phase names
 * @property {HistoryEntry[]} history - Execution history entries
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
    stateCache = JSON.parse(raw);
  } catch (error) {
    stateCache = getDefaultState();
  }

  return stateCache;
}

/**
 * Saves the orchestrator state synchronously.
 * Creates the state directory if it does not exist.
 *
 * @param {OrchestratorState} state - State object to save
 * @returns {void}
 */
export function saveState(state) {
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }

  const serialized = JSON.stringify(state, null, 2);
  writeFileSync(STATE_PATH, serialized, 'utf8');
  stateCache = state;
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
    new Set([...(current.completedPhases || []), phase])
  );

  const updated = {
    ...current,
    lastPhase: phase,
    nextPhase: nextPhase,
    completedPhases,
    history: [...(current.history || []), entry],
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

/** Exported paths for external use */
export { STATE_DIR, STATE_PATH };
