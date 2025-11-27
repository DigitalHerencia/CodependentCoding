// @ts-nocheck
/**
 * NDJSON Logger Service
 *
 * Provides structured logging in Newline-Delimited JSON format for DevCycle events.
 * Logs are stored in `.loaded-vibes/logs/*.ndjson` and include requirement ID tracking.
 * All entries pass through secret redaction middleware per TECH §9 and SPEC-SECURITY §2.
 *
 * @module dist/cli/services/ndjsonLogger
 * @see docs/TECH_REQUIREMENTS.md §4.5 - State & Telemetry
 * @see docs/TECH_REQUIREMENTS.md §5.3 - Diagnostics & Logs
 * @see docs/TECH_REQUIREMENTS.md §9 - Security, Quality, Compliance
 * @see spec/observability.spec.md §3 - Implementation Guidance
 * @see spec/security.spec.md §2 - Component Controls (Logging Stack)
 */

import { createWriteStream, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createFileGuard } from '../security/fileGuard.js';
import { getRedactor, redactLogEntry } from './redaction.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_LOGS_DIR = path.resolve(CURRENT_DIR, '..', '..', '..', '.loaded-vibes', 'logs');
const logFileGuard = createFileGuard();

/**
 * @typedef {Object} NDJSONEvent
 * @property {string} devCycleId - DevCycle identifier
 * @property {string} phase - Current phase (analyze, design, implement, validate, reflect)
 * @property {string} [requirementId] - Optional PRD/TECH requirement reference
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
 * Implements SPEC-OBS §3 logging requirements.
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
   *
   * @param {Partial<NDJSONEvent>} event - Event data to log
   * @returns {void}
   */
  log(event) {
    if (!this.stream) {
      this.initialize();
    }

    const fullEvent = {
      devCycleId: this.devCycleId,
      timestamp: new Date().toISOString(),
      severity: 'info',
      ...event,
    };

    // Apply comprehensive redaction to entire entry (message, data, etc.)
    const redactedEvent = redactLogEntry(fullEvent);

    const line = JSON.stringify(redactedEvent) + '\n';
    this.stream.write(line);
    this.eventCount++;

    if (this.includeConsole) {
      const icon = this._getSeverityIcon(redactedEvent.severity);
      console.log(`${icon} [${redactedEvent.phase || 'system'}] ${redactedEvent.message}`);
    }
  }

  /**
   * Logs a debug-level event.
   *
   * @param {string} phase - Current phase
   * @param {string} message - Log message
   * @param {Object} [data] - Optional additional data
   * @returns {void}
   */
  debug(phase, message, data) {
    this.log({ phase, message, severity: 'debug', data });
  }

  /**
   * Logs an info-level event.
   *
   * @param {string} phase - Current phase
   * @param {string} message - Log message
   * @param {Object} [data] - Optional additional data
   * @returns {void}
   */
  info(phase, message, data) {
    this.log({ phase, message, severity: 'info', data });
  }

  /**
   * Logs a warning-level event.
   *
   * @param {string} phase - Current phase
   * @param {string} message - Log message
   * @param {Object} [data] - Optional additional data
   * @returns {void}
   */
  warn(phase, message, data) {
    this.log({ phase, message, severity: 'warn', data });
  }

  /**
   * Logs an error-level event.
   *
   * @param {string} phase - Current phase
   * @param {string} message - Log message
   * @param {Object} [data] - Optional additional data
   * @returns {void}
   */
  error(phase, message, data) {
    this.log({ phase, message, severity: 'error', data });
  }

  /**
   * Logs an exception with sanitized stack trace.
   * Stack traces are redacted per SPEC-OBS §4 and SPEC-SECURITY §2.
   *
   * @param {string} phase - Current phase
   * @param {Error} err - Error object
   * @param {Object} [data] - Optional additional data
   * @returns {void}
   */
  exception(phase, err, data) {
    this.log({
      phase,
      message: err.message || 'Unknown error',
      severity: 'error',
      data: {
        ...data,
        stack: err.stack,
        name: err.name,
      },
    });
  }

  /**
   * Logs a checkpoint event.
   *
   * @param {string} phase - Current phase
   * @param {string} checkpointId - Checkpoint identifier
   * @param {boolean} approved - Whether checkpoint was approved
   * @param {string} [approver] - Who approved the checkpoint
   * @returns {void}
   */
  checkpoint(phase, checkpointId, approved, approver) {
    this.log({
      phase,
      checkpointId,
      message: `Checkpoint ${checkpointId}: ${approved ? 'approved' : 'rejected'}`,
      severity: approved ? 'info' : 'warn',
      data: { approved, approver },
    });
  }

  /**
   * Logs a requirement reference.
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
 *
 * @param {LoggerOptions} options - Logger options
 * @returns {NDJSONLogger}
 */
export function createLogger(options) {
  return new NDJSONLogger(options);
}

// Re-export redaction utilities for convenience
export {
  redactSensitive,
  redactLogEntry,
  DEFAULT_LOGS_DIR,
};
