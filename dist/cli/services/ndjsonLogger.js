// @ts-nocheck
/**
 * NDJSON Logger Service
 *
 * Provides structured logging in Newline-Delimited JSON format for DevCycle events.
 * Logs are stored in `.loaded-vibes/logs/*.ndjson` and include requirement ID tracking.
 * All entries pass through secret redaction middleware per TECH §9 and SPEC-SECURITY §2.
 *
 * Per Issue #33 and SPEC-OBS §3, all log entries must include `requirementId` metadata
 * for traceability. The logger loads requirement IDs from the manifest and automatically
 * includes them in log entries.
 *
 * @module dist/cli/services/ndjsonLogger
 * @see docs/TECH_REQUIREMENTS.md §4.5 - State & Telemetry
 * @see docs/TECH_REQUIREMENTS.md §5.3 - Diagnostics & Logs
 * @see docs/TECH_REQUIREMENTS.md §9 - Security, Quality, Compliance
 * @see docs/TECH_REQUIREMENTS.md §10 - Validation & Traceability (requirementId logging)
 * @see spec/observability.spec.md §3 - Implementation Guidance
 * @see spec/security.spec.md §2 - Component Controls (Logging Stack)
 */

import { createWriteStream, existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createFileGuard } from '../security/fileGuard.js';
import { getRedactor, redactLogEntry } from './redaction.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_LOGS_DIR = path.resolve(CURRENT_DIR, '..', '..', '..', '.loaded-vibes', 'logs');
const MANIFEST_PATH = path.resolve(CURRENT_DIR, '..', '..', 'genaiscript', 'devcycles.config.json');
const logFileGuard = createFileGuard();

/**
 * Loads the DevCycle manifest to extract requirement IDs.
 * Per TECH §10 and SPEC-OBS §3, logs must include requirementId metadata.
 *
 * @returns {Object} - Map of devCycleId to requirementIds array
 */
function loadManifestRequirementIds() {
  try {
    if (!existsSync(MANIFEST_PATH)) {
      return {};
    }
    const raw = readFileSync(MANIFEST_PATH, 'utf8');
    const manifest = JSON.parse(raw);
    const mapping = {};
    for (const [devCycleId, config] of Object.entries(manifest)) {
      mapping[devCycleId] = config.requirementIds || [];
    }
    return mapping;
  } catch {
    return {};
  }
}

// Cache manifest requirement IDs at module load
const MANIFEST_REQUIREMENT_IDS = loadManifestRequirementIds();

/**
 * @typedef {Object} NDJSONEvent
 * @property {string} devCycleId - DevCycle identifier
 * @property {string} phase - Current phase (analyze, design, implement, validate, reflect)
 * @property {string|string[]} requirementId - PRD/TECH requirement reference(s) - REQUIRED per SPEC-OBS §3
 * @property {'debug'|'info'|'warn'|'error'} severity - Log severity level
 * @property {string} [checkpointId] - Optional checkpoint identifier
 * @property {string} message - Human-readable log message
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {Object} [data] - Optional additional structured data
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [logsDir] - Directory for log files (default: .loaded-vibes/logs)
 * @property {string} devCycleId - DevCycle identifier for this logging session
 * @property {boolean} [includeConsole] - Also write logs to console (default: false)
 * @property {string[]} [requirementIds] - Override requirement IDs for this session
 */

/**
 * Redacts sensitive information from log data.
 * Implements TECH §9 and SPEC-SECURITY §2 requirements.
 * Delegates to the comprehensive redaction module for pattern-based and key-based redaction.
 *
 * @param {Object} data - Data object to redact
 * @returns {Object} Redacted data object
 * @deprecated Use redaction.js module directly for full control
 */
function redactSensitive(data) {
  return getRedactor().redactObject(data);
}

/**
 * Creates an NDJSON Logger instance for a DevCycle session.
 * Implements SPEC-OBS §3 logging requirements with requirementId tracking.
 */
export class NDJSONLogger {
  /**
   * @param {LoggerOptions} options - Logger configuration
   */
  constructor(options) {
    this.devCycleId = options.devCycleId;
    this.logsDir = options.logsDir || DEFAULT_LOGS_DIR;
    this.includeConsole = options.includeConsole || false;
    this.stream = null;
    this.logFilePath = null;
    this.eventCount = 0;

    // Load requirementIds from manifest or use provided override (TECH §10, SPEC-OBS §3)
    this.requirementIds = options.requirementIds ||
      MANIFEST_REQUIREMENT_IDS[this.devCycleId] ||
      [];
  }

  /**
   * Gets the requirement IDs for the current DevCycle.
   * Per TECH §10, CLI logs must include requirementId metadata for audits.
   *
   * @returns {string[]} - Array of requirement IDs
   */
  getRequirementIds() {
    return [...this.requirementIds];
  }

  /**
   * Formats requirement IDs as a comma-separated string for log entries.
   *
   * @returns {string} - Formatted requirement ID string
   */
  formatRequirementIds() {
    return this.requirementIds.length > 0
      ? this.requirementIds.join(', ')
      : 'SPEC-OBS §3';
  }

  /**
   * Initializes the log file stream.
   * Creates the logs directory if it doesn't exist.
   *
   * @returns {void}
   */
  initialize() {
    if (!existsSync(this.logsDir)) {
      logFileGuard.mkdirSync(this.logsDir, { recursive: true });
    }

    // Use YYYYMMDD-HHMMSS-mmm format for filename-safe timestamps
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      '-',
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
      '-',
      String(now.getMilliseconds()).padStart(3, '0'),
    ].join('');
    this.logFilePath = path.join(this.logsDir, `${this.devCycleId}-${timestamp}.ndjson`);
    logFileGuard.ensureWithinBoundarySync(this.logFilePath);
    this.stream = createWriteStream(this.logFilePath, { flags: 'a', encoding: 'utf8' });
  }

  /**
   * Logs an event in NDJSON format.
   * All entries pass through secret redaction middleware per TECH §9 and SPEC-SECURITY §2.
   * Per TECH §10 and SPEC-OBS §3, every entry includes: devCycleId, phase, requirementId,
   * severity, and checkpointId (when applicable).
   *
   * @param {Partial<NDJSONEvent>} event - Event data to log
   * @returns {void}
   */
  log(event) {
    if (!this.stream) {
      this.initialize();
    }

    // Include requirementId from manifest if not explicitly provided (TECH §10, SPEC-OBS §3)
    const requirementId = event.requirementId || this.formatRequirementIds();

    // Per SPEC-OBS §3, enforce required fields with sensible defaults:
    // - devCycleId: always from logger instance
    // - phase: default to 'system' if not provided
    // - requirementId: from manifest or explicit
    // - severity: default to 'info'
    // - checkpointId: include if provided, otherwise null (allows explicit presence for filtering)
    const fullEvent = {
      devCycleId: this.devCycleId,
      phase: event.phase || 'system',
      requirementId,
      severity: event.severity || 'info',
      checkpointId: event.checkpointId || null,
      timestamp: new Date().toISOString(),
      message: event.message || '',
      ...(event.data !== undefined ? { data: event.data } : {}),
    };

    // Apply comprehensive redaction to entire entry (message, data, etc.)
    const redactedEvent = redactLogEntry(fullEvent);

    const line = JSON.stringify(redactedEvent) + '\n';
    this.stream.write(line);
    this.eventCount++;

    if (this.includeConsole) {
      const icon = this._getSeverityIcon(redactedEvent.severity);
      console.log(`${icon} [${redactedEvent.phase}] ${redactedEvent.message}`);
    }
  }

  /**
   * Logs a debug-level event with automatic requirementId inclusion.
   *
   * @param {string} phase - Current phase
   * @param {string} message - Log message
   * @param {Object} [data] - Optional additional data
   * @param {string} [requirementId] - Override requirement ID
   * @returns {void}
   */
  debug(phase, message, data, requirementId) {
    this.log({ phase, message, severity: 'debug', data, requirementId });
  }

  /**
   * Logs an info-level event with automatic requirementId inclusion.
   *
   * @param {string} phase - Current phase
   * @param {string} message - Log message
   * @param {Object} [data] - Optional additional data
   * @param {string} [requirementId] - Override requirement ID
   * @returns {void}
   */
  info(phase, message, data, requirementId) {
    this.log({ phase, message, severity: 'info', data, requirementId });
  }

  /**
   * Logs a warning-level event with automatic requirementId inclusion.
   *
   * @param {string} phase - Current phase
   * @param {string} message - Log message
   * @param {Object} [data] - Optional additional data
   * @param {string} [requirementId] - Override requirement ID
   * @returns {void}
   */
  warn(phase, message, data, requirementId) {
    this.log({ phase, message, severity: 'warn', data, requirementId });
  }

  /**
   * Logs an error-level event with automatic requirementId inclusion.
   *
   * @param {string} phase - Current phase
   * @param {string} message - Log message
   * @param {Object} [data] - Optional additional data
   * @param {string} [requirementId] - Override requirement ID
   * @returns {void}
   */
  error(phase, message, data, requirementId) {
    this.log({ phase, message, severity: 'error', data, requirementId });
  }

  /**
   * Logs an exception with sanitized stack trace and automatic requirementId inclusion.
   * Stack traces are redacted per SPEC-OBS §4 and SPEC-SECURITY §2.
   *
   * @param {string} phase - Current phase
   * @param {Error} err - Error object
   * @param {Object} [data] - Optional additional data
   * @param {string} [requirementId] - Override requirement ID
   * @returns {void}
   */
  exception(phase, err, data, requirementId) {
    this.log({
      phase,
      message: err.message || 'Unknown error',
      severity: 'error',
      requirementId,
      data: {
        ...data,
        stack: err.stack,
        name: err.name,
      },
    });
  }

  /**
   * Logs a checkpoint event with automatic requirementId inclusion.
   *
   * @param {string} phase - Current phase
   * @param {string} checkpointId - Checkpoint identifier
   * @param {boolean} approved - Whether checkpoint was approved
   * @param {string} [approver] - Who approved the checkpoint
   * @param {string} [requirementId] - Override requirement ID
   * @returns {void}
   */
  checkpoint(phase, checkpointId, approved, approver, requirementId) {
    this.log({
      phase,
      checkpointId,
      message: `Checkpoint ${checkpointId}: ${approved ? 'approved' : 'rejected'}`,
      severity: approved ? 'info' : 'warn',
      requirementId,
      data: { approved, approver },
    });
  }

  /**
   * Logs a requirement reference. This method allows explicit requirement ID specification.
   *
   * @param {string} phase - Current phase
   * @param {string} requirementId - Requirement ID (e.g., 'PRD §5.1', 'TECH §4.2')
   * @param {string} message - Log message
   * @returns {void}
   */
  requirement(phase, requirementId, message) {
    this.log({ phase, requirementId, message, severity: 'info' });
  }

  /**
   * Closes the log stream.
   *
   * @returns {Promise<void>}
   */
  async close() {
    if (this.stream) {
      return new Promise((resolve) => {
        this.stream.end(() => {
          resolve();
        });
      });
    }
  }

  /**
   * Gets the log file path.
   *
   * @returns {string|null}
   */
  getLogFilePath() {
    return this.logFilePath;
  }

  /**
   * Gets the event count.
   *
   * @returns {number}
   */
  getEventCount() {
    return this.eventCount;
  }

  /**
   * @private
   * @param {'debug'|'info'|'warn'|'error'} severity
   * @returns {string}
   */
  _getSeverityIcon(severity) {
    switch (severity) {
      case 'debug':
        return '🔍';
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  }
}

/**
 * Creates a new NDJSON logger instance.
 * The logger automatically loads requirementIds from the manifest per TECH §10.
 *
 * @param {LoggerOptions} options - Logger options
 * @returns {NDJSONLogger}
 */
export function createLogger(options) {
  return new NDJSONLogger(options);
}

/**
 * Gets the requirement IDs for a specific DevCycle from the manifest.
 * Per TECH §10, CLI logs must include requirementId metadata for audits.
 *
 * @param {string} devCycleId - DevCycle identifier
 * @returns {string[]} - Array of requirement IDs from manifest, or empty array if not found
 */
export function getRequirementIdsForDevCycle(devCycleId) {
  return MANIFEST_REQUIREMENT_IDS[devCycleId] || [];
}

/**
 * Gets all manifest requirement ID mappings.
 * Per TECH §10, maintains mapping between PRD clauses and manifest entries.
 *
 * @returns {Object} - Map of devCycleId to requirementIds array
 */
export function getAllManifestRequirementIds() {
  return { ...MANIFEST_REQUIREMENT_IDS };
}

/**
 * Required fields per SPEC-OBS §3 for NDJSON log entries.
 * @type {string[]}
 */
export const REQUIRED_LOG_FIELDS = ['devCycleId', 'phase', 'requirementId', 'severity', 'timestamp'];

/**
 * Validates an NDJSON log entry against the required schema per SPEC-OBS §3.
 * Returns an object indicating validity and any missing fields.
 *
 * Required fields (SPEC-OBS §3):
 * - devCycleId: string (non-empty)
 * - phase: string (non-empty)
 * - requirementId: string or string[] (non-empty)
 * - severity: 'debug' | 'info' | 'warn' | 'error'
 * - timestamp: ISO 8601 string
 * - checkpointId: string | null (must be present, can be null if not applicable)
 *
 * @param {Object} entry - Log entry to validate
 * @returns {{ valid: boolean, missingFields: string[], invalidFields: string[] }}
 */
export function validateLogEntry(entry) {
  const missingFields = [];
  const invalidFields = [];
  const validSeverities = ['debug', 'info', 'warn', 'error'];

  if (!entry || typeof entry !== 'object') {
    return { valid: false, missingFields: ['entry'], invalidFields: [] };
  }

  // Check required string fields
  if (!entry.devCycleId || typeof entry.devCycleId !== 'string') {
    missingFields.push('devCycleId');
  }

  if (!entry.phase || typeof entry.phase !== 'string') {
    missingFields.push('phase');
  }

  if (!entry.timestamp || typeof entry.timestamp !== 'string') {
    missingFields.push('timestamp');
  } else {
    // Validate ISO 8601 format
    const timestamp = new Date(entry.timestamp);
    if (isNaN(timestamp.getTime())) {
      invalidFields.push('timestamp');
    }
  }

  // Validate requirementId (string or array of strings)
  if (!entry.requirementId) {
    missingFields.push('requirementId');
  } else if (typeof entry.requirementId !== 'string' && !Array.isArray(entry.requirementId)) {
    invalidFields.push('requirementId');
  } else if (Array.isArray(entry.requirementId) && entry.requirementId.length === 0) {
    invalidFields.push('requirementId');
  }

  // Validate severity
  if (!entry.severity) {
    missingFields.push('severity');
  } else if (!validSeverities.includes(entry.severity)) {
    invalidFields.push('severity');
  }

  // checkpointId must be present (can be null for non-checkpoint events)
  if (!('checkpointId' in entry)) {
    missingFields.push('checkpointId');
  }

  return {
    valid: missingFields.length === 0 && invalidFields.length === 0,
    missingFields,
    invalidFields,
  };
}

/**
 * Parses and validates an NDJSON line, returning the entry if valid or null if invalid.
 * Used by log readers to filter out malformed entries.
 *
 * @param {string} line - Single line of NDJSON
 * @returns {{ entry: Object | null, validation: { valid: boolean, missingFields: string[], invalidFields: string[] } }}
 */
export function parseAndValidateLogLine(line) {
  const trimmed = (line || '').trim();
  if (!trimmed) {
    return { entry: null, validation: { valid: false, missingFields: ['line'], invalidFields: [] } };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const validation = validateLogEntry(parsed);
    return { entry: validation.valid ? parsed : null, validation };
  } catch {
    return { entry: null, validation: { valid: false, missingFields: [], invalidFields: ['json'] } };
  }
}

// Re-export redaction utilities and manifest constants for convenience
export {
  redactSensitive,
  redactLogEntry,
  DEFAULT_LOGS_DIR,
  MANIFEST_PATH,
  loadManifestRequirementIds,
};
