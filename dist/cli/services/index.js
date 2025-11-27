// @ts-nocheck
/**
 * CLI Services Module
 *
 * Exports all CLI service modules for use by the Loaded Vibes CLI.
 *
 * @module dist/cli/services
 * @see docs/TECH_REQUIREMENTS.md §5 - Retro CLI Platform Requirements
 * @see docs/TECH_REQUIREMENTS.md §9 - Security, Quality, Compliance
 */

export {
  DevCycleRunner,
  createRunner,
  runDevCycle,
  getRunnerState,
  canResume,
  loadRunnerState,
  saveRunnerState,
  getDefaultRunnerState,
  RUNNER_STATE_PATH,
} from './devcycleRunner.js';

export {
  NDJSONLogger,
  createLogger,
  redactSensitive,
  redactLogEntry,
  DEFAULT_LOGS_DIR,
} from './ndjsonLogger.js';

export {
  SecretRedactor,
  createRedactor,
  getRedactor,
  redactString,
  redactStackTrace,
  redactTelemetry,
  loadConfig as loadRedactionConfig,
  DEFAULT_CONFIG as DEFAULT_REDACTION_CONFIG,
  REDACTED_PLACEHOLDER,
} from './redaction.js';

export {
  runAttachWorkflow,
  enumerateConflicts,
  detectExistingRepo,
  applyMirror,
  applyMerge,
  applySandbox,
  writeInstallLog,
  DEFAULT_FOCUS_SEGMENTS,
  DEFAULT_SOURCE_ROOT,
} from '../attachWorkflow.js';
