// @ts-nocheck
/**
 * Validators Utility
 *
 * Provides validation helpers for manifest entries, file existence,
 * state consistency, and requirement references.
 *
 * @module validators
 * @see PRD §5, TECH_REQUIREMENTS §4.4, SPEC-ARCH §1.2
 */

import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');
const DIST_ROOT = path.resolve(REPO_ROOT, 'dist');
const MANIFEST_PATH = path.resolve(GENAI_ROOT, 'devcycles.config.json');

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 */

/**
 * Creates a successful validation result.
 *
 * @returns {ValidationResult}
 */
export function validResult() {
  return { valid: true, errors: [], warnings: [] };
}

/**
 * Creates a failed validation result.
 *
 * @param {string[]} errors - Error messages
 * @param {string[]} [warnings=[]] - Warning messages
 * @returns {ValidationResult}
 */
export function invalidResult(errors, warnings = []) {
  return { valid: false, errors, warnings };
}

/**
 * Merges multiple validation results into one.
 *
 * @param {...ValidationResult} results - Results to merge
 * @returns {ValidationResult}
 */
export function mergeResults(...results) {
  const merged = {
    valid: true,
    errors: [],
    warnings: [],
  };

  for (const result of results) {
    if (!result.valid) {
      merged.valid = false;
    }
    merged.errors.push(...result.errors);
    merged.warnings.push(...result.warnings);
  }

  return merged;
}

/**
 * Validates that a file exists at the given path.
 *
 * @param {string} filePath - Path to check
 * @param {string} [context=''] - Context for error message
 * @returns {ValidationResult}
 */
export function validateFileExists(filePath, context = '') {
  const prefix = context ? `${context}: ` : '';
  if (!existsSync(filePath)) {
    return invalidResult([`${prefix}File not found: ${filePath}`]);
  }
  return validResult();
}

/**
 * Validates that a directory exists at the given path.
 *
 * @param {string} dirPath - Path to check
 * @param {string} [context=''] - Context for error message
 * @returns {ValidationResult}
 */
export function validateDirectoryExists(dirPath, context = '') {
  const prefix = context ? `${context}: ` : '';
  if (!existsSync(dirPath)) {
    return invalidResult([`${prefix}Directory not found: ${dirPath}`]);
  }
  return validResult();
}

/**
 * Loads and parses the devcycles.config.json manifest.
 *
 * @returns {{manifest: object|null, error: string|null}}
 */
export function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return { manifest: null, error: 'Manifest file not found: ' + MANIFEST_PATH };
  }

  try {
    const raw = readFileSync(MANIFEST_PATH, 'utf8');
    const manifest = JSON.parse(raw);
    return { manifest, error: null };
  } catch (err) {
    return { manifest: null, error: 'Failed to parse manifest: ' + err.message };
  }
}

/**
 * Validates a single DevCycle entry from the manifest.
 *
 * @param {string} key - DevCycle key
 * @param {object} entry - DevCycle entry object
 * @returns {ValidationResult}
 */
export function validateDevCycleEntry(key, entry) {
  const errors = [];
  const warnings = [];

  // Required fields
  const requiredFields = ['label', 'description', 'instructions', 'toolset', 'prompt'];
  for (const field of requiredFields) {
    if (!entry[field]) {
      errors.push(`DevCycle '${key}': Missing required field '${field}'`);
    }
  }

  // Validate file references exist
  if (entry.instructions) {
    const instrPath = path.resolve(GENAI_ROOT, entry.instructions);
    if (!existsSync(instrPath)) {
      errors.push(`DevCycle '${key}': Instructions file not found: ${entry.instructions}`);
    }
  }

  if (entry.toolset) {
    const toolsetPath = path.resolve(GENAI_ROOT, entry.toolset);
    if (!existsSync(toolsetPath)) {
      errors.push(`DevCycle '${key}': Toolset file not found: ${entry.toolset}`);
    }
  }

  if (entry.prompt) {
    const promptPath = path.resolve(GENAI_ROOT, entry.prompt);
    if (!existsSync(promptPath)) {
      errors.push(`DevCycle '${key}': Prompt file not found: ${entry.prompt}`);
    }
  }

  // Validate checkpoints array
  if (!entry.checkpoints || !Array.isArray(entry.checkpoints)) {
    warnings.push(`DevCycle '${key}': Missing or invalid checkpoints array`);
  }

  if (errors.length > 0) {
    return invalidResult(errors, warnings);
  }
  const result = validResult();
  result.warnings = warnings;
  return result;
}

/**
 * Validates the entire DevCycles manifest.
 *
 * @returns {ValidationResult}
 */
export function validateManifest() {
  const { manifest, error } = loadManifest();

  if (error) {
    return invalidResult([error]);
  }

  const results = [];
  const keys = Object.keys(manifest);

  if (keys.length === 0) {
    return invalidResult(['Manifest is empty: no DevCycles defined']);
  }

  for (const key of keys) {
    results.push(validateDevCycleEntry(key, manifest[key]));
  }

  return mergeResults(...results);
}

/**
 * Validates that a requirement reference exists in PRD or Tech Requirements.
 *
 * @param {string} reference - Reference string (e.g., "PRD §5.1", "TECH §4.2")
 * @returns {ValidationResult}
 */
export function validateRequirementReference(reference) {
  const prdPath = path.resolve(REPO_ROOT, 'docs', 'PRD.md');
  const techPath = path.resolve(REPO_ROOT, 'docs', 'TECH_REQUIREMENTS.md');

  // Extract document type from reference
  const isPRD = reference.toLowerCase().includes('prd');
  const isTech = reference.toLowerCase().includes('tech');

  if (!isPRD && !isTech) {
    return { valid: true, errors: [], warnings: ['Unknown reference format: ' + reference] };
  }

  const targetPath = isPRD ? prdPath : techPath;

  if (!existsSync(targetPath)) {
    return invalidResult([`Reference document not found: ${targetPath}`]);
  }

  // We don't parse section numbers deeply; just verify the file exists
  return validResult();
}

/**
 * Validates core project files exist.
 *
 * @returns {ValidationResult}
 */
export function validateCoreFiles() {
  const coreFiles = [
    { path: path.resolve(REPO_ROOT, 'docs', 'PRD.md'), name: 'PRD.md' },
    { path: path.resolve(REPO_ROOT, 'docs', 'TECH_REQUIREMENTS.md'), name: 'TECH_REQUIREMENTS.md' },
    { path: path.resolve(REPO_ROOT, 'TODO.md'), name: 'TODO.md' },
    { path: path.resolve(REPO_ROOT, 'CHANGELOG.md'), name: 'CHANGELOG.md' },
    { path: path.resolve(REPO_ROOT, 'README.md'), name: 'README.md' },
  ];

  const errors = [];
  const warnings = [];

  for (const file of coreFiles) {
    if (!existsSync(file.path)) {
      errors.push(`Core file missing: ${file.name}`);
    }
  }

  return errors.length > 0 ? invalidResult(errors, warnings) : validResult();
}

/**
 * @typedef {Object} ExecutionSnapshot
 * @property {string} phase - DevCycle phase name
 * @property {Object} params - Execution parameters (mode, task, etc.)
 * @property {Object} outputs - Phase outputs and artifacts
 * @property {Object} timestamps - Phase timing information
 * @property {string} timestamps.startTime - ISO 8601 start timestamp
 * @property {string} timestamps.endTime - ISO 8601 end timestamp
 * @property {number} timestamps.durationMs - Duration in milliseconds
 * @property {'pending'|'running'|'complete'|'failed'|'blocked'} status - Execution status
 * @property {string|null} errorMessage - Error message if failed
 * @see TECH §4.5, SPEC-ENGINE §5
 */

/**
 * Validates an execution snapshot object structure.
 *
 * @param {Object} snapshot - Snapshot to validate
 * @param {number} index - Index in snapshots array (for error messages)
 * @returns {ValidationResult}
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function validateExecutionSnapshot(snapshot, index) {
  const errors = [];
  const warnings = [];
  const prefix = `Snapshot[${index}]`;

  if (!snapshot || typeof snapshot !== 'object') {
    return invalidResult([`${prefix}: Invalid snapshot object`]);
  }

  // Required fields
  if (typeof snapshot.phase !== 'string' || !snapshot.phase) {
    errors.push(`${prefix}: Missing or invalid 'phase' field`);
  }

  if (!snapshot.params || typeof snapshot.params !== 'object') {
    warnings.push(`${prefix}: Missing 'params' object`);
  }

  if (!snapshot.outputs || typeof snapshot.outputs !== 'object') {
    warnings.push(`${prefix}: Missing 'outputs' object`);
  }

  if (!snapshot.timestamps || typeof snapshot.timestamps !== 'object') {
    errors.push(`${prefix}: Missing 'timestamps' object`);
  } else {
    if (!snapshot.timestamps.startTime) {
      errors.push(`${prefix}: Missing 'timestamps.startTime'`);
    }
  }

  const validStatuses = ['pending', 'running', 'complete', 'failed', 'blocked'];
  if (!validStatuses.includes(snapshot.status)) {
    warnings.push(`${prefix}: Invalid status '${snapshot.status}', expected one of: ${validStatuses.join(', ')}`);
  }

  return errors.length > 0 ? invalidResult(errors, warnings) : { valid: true, errors: [], warnings };
}

/**
 * Validates state.json structure including execution snapshots.
 *
 * @returns {ValidationResult}
 * @see TECH §4.5, SPEC-ENGINE §5
 */
export function validateStateFile() {
  const statePath = path.resolve(GENAI_ROOT, 'state', 'state.json');

  if (!existsSync(statePath)) {
    return { valid: true, errors: [], warnings: ['State file does not exist yet (will be created on first run)'] };
  }

  try {
    const raw = readFileSync(statePath, 'utf8');
    const state = JSON.parse(raw);

    const errors = [];
    const warnings = [];

    // Check for expected fields
    if (!('lastPhase' in state)) {
      warnings.push('State missing lastPhase field');
    }
    if (!('completedPhases' in state) || !Array.isArray(state.completedPhases)) {
      warnings.push('State missing or invalid completedPhases array');
    }
    if (!('history' in state) || !Array.isArray(state.history)) {
      warnings.push('State missing or invalid history array');
    }

    // Validate execution snapshots (TECH §4.5, SPEC-ENGINE §5)
    if (state.executionSnapshots && Array.isArray(state.executionSnapshots)) {
      for (let i = 0; i < state.executionSnapshots.length; i++) {
        const snapshotResult = validateExecutionSnapshot(state.executionSnapshots[i], i);
        errors.push(...snapshotResult.errors);
        warnings.push(...snapshotResult.warnings);
      }
    }

    // Check for lastUpdated timestamp
    if (!state.lastUpdated) {
      warnings.push('State missing lastUpdated timestamp');
    }

    return errors.length > 0 ? invalidResult(errors, warnings) : { valid: true, errors: [], warnings };
  } catch (err) {
    return invalidResult(['Failed to parse state.json: ' + err.message]);
  }
}

/**
 * Runs all validation checks and returns a comprehensive report.
 *
 * @returns {ValidationResult}
 */
export function validateAll() {
  return mergeResults(
    validateCoreFiles(),
    validateManifest(),
    validateStateFile()
  );
}

/** Exported paths for external use */
export { GENAI_ROOT, REPO_ROOT, DIST_ROOT, MANIFEST_PATH };
