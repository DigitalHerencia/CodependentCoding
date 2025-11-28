// @ts-nocheck
/**
 * Idempotency Utility Module
 *
 * Provides idempotency checks and hash comparison utilities to guarantee
 * DevCycle reruns produce no duplicate entries, no state corruption,
 * and no unnecessary file writes per TECH §9.
 *
 * @module idempotency
 * @see TECH_REQUIREMENTS §9, SPEC-SECURITY §1, Issue #22
 */

import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');

/**
 * @typedef {Object} IdempotencyCheckResult
 * @property {boolean} isIdempotent - Whether the operation would be idempotent (no change needed)
 * @property {boolean} wouldDuplicate - Whether the operation would create a duplicate
 * @property {string|null} existingHash - Hash of existing content if applicable
 * @property {string|null} newHash - Hash of new content if applicable
 * @property {string|null} warningMessage - Warning message if rerun attempts modification
 * @property {string|null} remediation - Remediation instructions if applicable
 */

/**
 * @typedef {Object} HashComparisonResult
 * @property {boolean} unchanged - True if content hashes match (no write needed)
 * @property {string} existingHash - SHA256 hash of existing content
 * @property {string} newHash - SHA256 hash of new content
 */

/**
 * Computes SHA256 hash of content.
 *
 * @param {string} content - Content to hash
 * @returns {string} SHA256 hash as hex string
 */
export function computeHash(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Compares content hashes to determine if a write is necessary.
 * Returns unchanged=true if content is identical (idempotent).
 *
 * @param {string} existingContent - Current file content
 * @param {string} newContent - Proposed new content
 * @returns {HashComparisonResult}
 * @see TECH §9 - Automated operations are idempotent
 */
export function compareHashes(existingContent, newContent) {
  const existingHash = computeHash(existingContent);
  const newHash = computeHash(newContent);

  return {
    unchanged: existingHash === newHash,
    existingHash,
    newHash,
  };
}

/**
 * Checks if writing to a file would be idempotent (no change needed).
 *
 * @param {string} filePath - Path to the file
 * @param {string} newContent - Proposed new content
 * @returns {HashComparisonResult & { exists: boolean }}
 * @see TECH §9
 */
export function checkFileIdempotency(filePath, newContent) {
  if (!existsSync(filePath)) {
    return {
      unchanged: false,
      exists: false,
      existingHash: '',
      newHash: computeHash(newContent),
    };
  }

  try {
    const existingContent = readFileSync(filePath, 'utf8');
    const comparison = compareHashes(existingContent, newContent);
    return {
      ...comparison,
      exists: true,
    };
  } catch {
    return {
      unchanged: false,
      exists: false,
      existingHash: '',
      newHash: computeHash(newContent),
    };
  }
}

/**
 * Checks if a TODO entry already exists (prevents duplicates).
 * Uses normalized text comparison for matching.
 *
 * @param {string} todoContent - Full TODO.md content
 * @param {string} itemDescription - Item description to check
 * @returns {IdempotencyCheckResult}
 * @see TECH §9, Issue #22
 */
export function checkTodoEntryExists(todoContent, itemDescription) {
  const normalizedSearch = normalizeText(itemDescription);

  // Check for existing entry with similar description
  const lines = todoContent.split('\n');
  for (const line of lines) {
    // Match table rows with status indicators
    if (line.match(/^\|\s*[☑☐\[x\]]/i)) {
      const normalizedLine = normalizeText(line);
      if (normalizedLine.includes(normalizedSearch)) {
        return {
          isIdempotent: true,
          wouldDuplicate: true,
          existingHash: null,
          newHash: null,
          warningMessage: `TODO entry already exists: "${itemDescription.slice(0, 50)}..."`,
          remediation: 'Skip adding duplicate entry. Reference: TECH §9 - DevCycle operations are idempotent.',
        };
      }
    }
  }

  return {
    isIdempotent: false,
    wouldDuplicate: false,
    existingHash: null,
    newHash: null,
    warningMessage: null,
    remediation: null,
  };
}

/**
 * Checks if a CHANGELOG entry already exists within a time tolerance.
 * Uses goal text and timestamp proximity for matching.
 *
 * @param {string} changelogContent - Full CHANGELOG.md content
 * @param {string} goal - Entry goal to check
 * @param {string} timestamp - Entry timestamp (ISO 8601)
 * @param {number} [toleranceMinutes=5] - Time tolerance in minutes
 * @returns {IdempotencyCheckResult}
 * @see TECH §9, Issue #22
 */
export function checkChangelogEntryExists(changelogContent, goal, timestamp, toleranceMinutes = 5) {
  const normalizedGoal = normalizeText(goal);

  // Parse target timestamp with error handling
  let targetTime;
  try {
    targetTime = new Date(timestamp).getTime();
    if (isNaN(targetTime)) {
      // Invalid timestamp, return no duplicate
      return {
        isIdempotent: false,
        wouldDuplicate: false,
        existingHash: null,
        newHash: null,
        warningMessage: null,
        remediation: null,
      };
    }
  } catch {
    // Invalid timestamp format, return no duplicate
    return {
      isIdempotent: false,
      wouldDuplicate: false,
      existingHash: null,
      newHash: null,
      warningMessage: null,
      remediation: null,
    };
  }

  const toleranceMs = toleranceMinutes * 60 * 1000;

  const lines = changelogContent.split('\n');
  for (const line of lines) {
    // Match changelog entry pattern: [Type][timestamp]
    const match = line.match(/^\[(?:Decision|Update|Validation|Fix|Feature|CI|Infrastructure|Security)\]\[([^\]]+)\]/);
    if (match) {
      try {
        const entryTime = new Date(match[1]).getTime();
        if (isNaN(entryTime)) {
          continue; // Invalid entry timestamp, skip
        }
        const timeDiff = Math.abs(targetTime - entryTime);

        // Check if within tolerance and goal matches
        const normalizedLine = normalizeText(line);
        if (timeDiff < toleranceMs && normalizedLine.includes(normalizedGoal)) {
          return {
            isIdempotent: true,
            wouldDuplicate: true,
            existingHash: null,
            newHash: null,
            warningMessage: `CHANGELOG entry already exists: "${goal.slice(0, 50)}..."`,
            remediation: 'Skip adding duplicate entry. Reference: TECH §9 - DevCycle operations are idempotent.',
          };
        }
      } catch {
        // Invalid timestamp, continue checking
      }
    }
  }

  return {
    isIdempotent: false,
    wouldDuplicate: false,
    existingHash: null,
    newHash: null,
    warningMessage: null,
    remediation: null,
  };
}

/**
 * Checks if a state snapshot would cause corruption or duplicate history.
 *
 * @param {Object} existingState - Current state object
 * @param {Object} proposedUpdate - Proposed state update
 * @returns {IdempotencyCheckResult}
 * @see TECH §9, SPEC-ENGINE §5, Issue #22
 */
export function checkStateIntegrity(existingState, proposedUpdate) {
  // Check for duplicate history entries
  const existingHistory = existingState.history || [];
  const proposedHistory = proposedUpdate.history || [];

  if (proposedHistory.length > 0) {
    const lastProposed = proposedHistory[proposedHistory.length - 1];

    // Check if this exact history entry already exists
    for (const existing of existingHistory) {
      if (
        existing.phase === lastProposed.phase &&
        existing.mode === lastProposed.mode &&
        existing.task === lastProposed.task
      ) {
        // Check timestamp proximity (within 1 minute)
        const existingTime = new Date(existing.timestamp).getTime();
        const proposedTime = new Date(lastProposed.timestamp).getTime();
        if (Math.abs(existingTime - proposedTime) < 60000) {
          return {
            isIdempotent: true,
            wouldDuplicate: true,
            existingHash: computeHash(JSON.stringify(existingState)),
            newHash: computeHash(JSON.stringify(proposedUpdate)),
            warningMessage: `Duplicate history entry detected for phase: ${lastProposed.phase}`,
            remediation: 'Skip duplicate state update. Reference: TECH §9, SPEC-ENGINE §5.',
          };
        }
      }
    }
  }

  // Check for duplicate execution snapshots
  const existingSnapshots = existingState.executionSnapshots || [];
  const proposedSnapshots = proposedUpdate.executionSnapshots || [];

  if (proposedSnapshots.length > 0) {
    const lastProposedSnapshot = proposedSnapshots[proposedSnapshots.length - 1];

    for (const existing of existingSnapshots) {
      if (
        existing.phase === lastProposedSnapshot.phase &&
        existing.status === lastProposedSnapshot.status &&
        existing.timestamps?.startTime === lastProposedSnapshot.timestamps?.startTime
      ) {
        return {
          isIdempotent: true,
          wouldDuplicate: true,
          existingHash: computeHash(JSON.stringify(existingState)),
          newHash: computeHash(JSON.stringify(proposedUpdate)),
          warningMessage: `Duplicate execution snapshot for phase: ${lastProposedSnapshot.phase}`,
          remediation: 'Skip duplicate snapshot. Reference: TECH §9, SPEC-ENGINE §5.',
        };
      }
    }
  }

  return {
    isIdempotent: false,
    wouldDuplicate: false,
    existingHash: computeHash(JSON.stringify(existingState)),
    newHash: computeHash(JSON.stringify(proposedUpdate)),
    warningMessage: null,
    remediation: null,
  };
}

/**
 * Normalizes text for comparison by removing whitespace variations,
 * converting to lowercase, and stripping special characters.
 *
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .trim();
}

/**
 * Logs an idempotency warning with remediation instructions.
 *
 * @param {IdempotencyCheckResult} result - Check result with warning
 * @param {string} context - Context for the warning (e.g., "TODO update", "CHANGELOG entry")
 * @see TECH §9, Issue #22
 */
export function logIdempotencyWarning(result, context) {
  if (result.warningMessage) {
    console.warn(`⚠️  [Idempotency] ${context}:`);
    console.warn(`   Warning: ${result.warningMessage}`);
    if (result.remediation) {
      console.warn(`   Remediation: ${result.remediation}`);
    }
  }
}

/**
 * Creates a detailed idempotency violation report for logging/NDJSON.
 *
 * @param {string} operation - Operation that was attempted
 * @param {IdempotencyCheckResult} result - Check result
 * @param {Object} [metadata={}] - Additional metadata
 * @returns {Object} Report object suitable for NDJSON logging
 * @see TECH §9, SPEC-OBS §3
 */
export function createIdempotencyReport(operation, result, metadata = {}) {
  return {
    type: 'idempotency-check',
    operation,
    isIdempotent: result.isIdempotent,
    wouldDuplicate: result.wouldDuplicate,
    warningMessage: result.warningMessage,
    remediation: result.remediation,
    timestamp: new Date().toISOString(),
    references: ['TECH §9', 'SPEC-SECURITY §1'],
    ...metadata,
  };
}

/**
 * Validates that a proposed state update maintains integrity.
 * Blocks updates that would corrupt existing state.
 *
 * @param {Object} existingState - Current state object
 * @param {Object} proposedUpdate - Proposed state update
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 * @see TECH §9, SPEC-ENGINE §5, Issue #22
 */
export function validateStateUpdate(existingState, proposedUpdate) {
  const errors = [];
  const warnings = [];

  // Ensure required fields are present
  if (!proposedUpdate.lastUpdated && proposedUpdate.lastUpdated !== null) {
    warnings.push('State update missing lastUpdated timestamp');
  }

  // Ensure completedPhases is a valid array
  if (proposedUpdate.completedPhases && !Array.isArray(proposedUpdate.completedPhases)) {
    errors.push('completedPhases must be an array');
  }

  // Ensure history entries are not corrupted
  if (proposedUpdate.history) {
    if (!Array.isArray(proposedUpdate.history)) {
      errors.push('history must be an array');
    } else {
      for (let i = 0; i < proposedUpdate.history.length; i++) {
        const entry = proposedUpdate.history[i];
        if (!entry.phase || !entry.timestamp) {
          warnings.push(`History entry ${i} missing required fields (phase, timestamp)`);
        }
      }
    }
  }

  // Check for execution snapshot integrity
  if (proposedUpdate.executionSnapshots) {
    if (!Array.isArray(proposedUpdate.executionSnapshots)) {
      errors.push('executionSnapshots must be an array');
    } else {
      for (let i = 0; i < proposedUpdate.executionSnapshots.length; i++) {
        const snapshot = proposedUpdate.executionSnapshots[i];
        if (!snapshot.phase || !snapshot.timestamps?.startTime) {
          warnings.push(`Execution snapshot ${i} missing required fields`);
        }
      }
    }
  }

  // Verify no regression in completedPhases
  const existingCompleted = new Set(existingState.completedPhases || []);
  const proposedCompleted = new Set(proposedUpdate.completedPhases || []);
  const removedPhases = [...existingCompleted].filter((p) => !proposedCompleted.has(p));
  if (removedPhases.length > 0) {
    warnings.push(`State update removes previously completed phases: ${removedPhases.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/** Exported paths for external use */
export { GENAI_ROOT, REPO_ROOT };
