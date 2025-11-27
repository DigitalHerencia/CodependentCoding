// @ts-nocheck
/**
 * NDJSON Logger Service
 *
 * Provides structured logging in Newline-Delimited JSON format for DevCycle events.
 * Logs are stored in `.loaded-vibes/logs/*.ndjson` and include requirement ID tracking.
 *
 * @module dist/cli/services/ndjsonLogger
 * @see docs/TECH_REQUIREMENTS.md §4.5 - State & Telemetry
 * @see docs/TECH_REQUIREMENTS.md §5.3 - Diagnostics & Logs
 * @see spec/observability.spec.md §3 - Implementation Guidance
 */

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_LOGS_DIR = path.resolve(CURRENT_DIR, '..', '..', '..', '.loaded-vibes', 'logs');

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
 *
 * @param {Object} data - Data object to redact
 * @returns {Object} Redacted data object
 */
function redactSensitive(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'secret',
    'token',
    'api_key',
    'apikey',
    'api-key',
    'authorization',
    'auth',
    'credential',
    'private_key',
    'privatekey',
    'private-key',
  ];

  const redacted = { ...data };

  for (const key of Object.keys(redacted)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitive(redacted[key]);
    }
  }

  return redacted;
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
      mkdirSync(this.logsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFilePath = path.join(this.logsDir, `${this.devCycleId}-${timestamp}.ndjson`);
    this.stream = createWriteStream(this.logFilePath, { flags: 'a', encoding: 'utf8' });
  }

  /**
   * Logs an event in NDJSON format.
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
      data: event.data ? redactSensitive(event.data) : undefined,
    };

    const line = JSON.stringify(fullEvent) + '\n';
    this.stream.write(line);
    this.eventCount++;

    if (this.includeConsole) {
      const icon = this._getSeverityIcon(fullEvent.severity);
      console.log(`${icon} [${fullEvent.phase || 'system'}] ${fullEvent.message}`);
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

export { redactSensitive, DEFAULT_LOGS_DIR };
