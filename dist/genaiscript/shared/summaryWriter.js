// @ts-nocheck
/**
 * Summary Writer Module
 *
 * Generates dual-mode execution summaries (JSON + Markdown) for DevCycles.
 * Implements ADR-0001 decision for paired output formats to serve both
 * machine consumers (CI, dashboards) and human consumers (PR reviews).
 *
 * @module summaryWriter
 * @see TECH_REQUIREMENTS §11.1-11.3, SPEC-OBS §2, ADR-0001, Issue #73
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');

/** Default summaries directory per TECH §11.2 */
const DEFAULT_SUMMARIES_DIR = path.resolve(REPO_ROOT, '.loaded-vibes', 'summaries');

/**
 * @typedef {Object} CheckpointApproval
 * @property {string} id - Checkpoint identifier
 * @property {boolean} approved - Whether the checkpoint was approved
 * @property {string} [approver] - Approver identifier (username or system)
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} passed - Whether validation passed
 * @property {string} [details] - Validation details or error message
 */

/**
 * @typedef {Object} ExecutionSummary
 * @property {string} devCycleId - DevCycle identifier (e.g., "scaffolding", "testing")
 * @property {string} phase - Execution phase (e.g., "reflect", "complete")
 * @property {string} startTime - ISO 8601 start timestamp
 * @property {string} endTime - ISO 8601 end timestamp
 * @property {'success'|'failure'|'skipped'} status - Execution status
 * @property {string[]} requirementIds - Requirement citations (e.g., ["TECH §11", "PRD §5.4"])
 * @property {CheckpointApproval[]} checkpoints - Checkpoint approval records
 * @property {ValidationResult} validationResult - Validation summary
 * @property {string[]} artifacts - Paths to generated artifacts
 * @property {string} [logFile] - Relative path to NDJSON log file
 */

/**
 * @typedef {Object} SummaryWriteResult
 * @property {boolean} success - Whether write was successful
 * @property {string} [error] - Error message if failed
 * @property {string} [jsonPath] - Path to JSON summary file
 * @property {string} [markdownPath] - Path to Markdown summary file
 * @property {string} [timestamp] - Timestamp used for filenames
 */

/**
 * Generates a timestamp string suitable for filenames.
 * Format: YYYY-MM-DDTHH-MM-SS-MMMZ (ISO-like, filesystem-safe)
 *
 * @returns {string} Timestamp string
 */
export function generateFilenameTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Validates an ExecutionSummary object against the required schema.
 * Returns validation errors if any required fields are missing or invalid.
 *
 * @param {ExecutionSummary} summary - Summary to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 * @see TECH §11.3
 */
export function validateSummarySchema(summary) {
  const errors = [];

  // Required string fields
  if (!summary.devCycleId || typeof summary.devCycleId !== 'string') {
    errors.push('devCycleId is required and must be a string');
  }
  if (!summary.phase || typeof summary.phase !== 'string') {
    errors.push('phase is required and must be a string');
  }
  if (!summary.startTime || typeof summary.startTime !== 'string') {
    errors.push('startTime is required and must be an ISO 8601 string');
  }
  if (!summary.endTime || typeof summary.endTime !== 'string') {
    errors.push('endTime is required and must be an ISO 8601 string');
  }

  // Status validation
  const validStatuses = ['success', 'failure', 'skipped'];
  if (!summary.status || !validStatuses.includes(summary.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }

  // Array validations
  if (!Array.isArray(summary.requirementIds)) {
    errors.push('requirementIds must be an array');
  }
  if (!Array.isArray(summary.checkpoints)) {
    errors.push('checkpoints must be an array');
  } else {
    for (let i = 0; i < summary.checkpoints.length; i++) {
      const cp = summary.checkpoints[i];
      if (!cp.id || typeof cp.id !== 'string') {
        errors.push(`checkpoints[${i}].id is required and must be a string`);
      }
      if (typeof cp.approved !== 'boolean') {
        errors.push(`checkpoints[${i}].approved must be a boolean`);
      }
    }
  }

  // Validation result
  if (!summary.validationResult || typeof summary.validationResult !== 'object') {
    errors.push('validationResult is required and must be an object');
  } else if (typeof summary.validationResult.passed !== 'boolean') {
    errors.push('validationResult.passed must be a boolean');
  }

  // Artifacts array
  if (!Array.isArray(summary.artifacts)) {
    errors.push('artifacts must be an array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Formats an ExecutionSummary as a JSON string with proper formatting.
 *
 * @param {ExecutionSummary} summary - Summary to format
 * @returns {string} JSON string
 */
export function formatSummaryAsJSON(summary) {
  return JSON.stringify(summary, null, 2);
}

/**
 * Generates YAML frontmatter from an ExecutionSummary for Markdown files.
 * This enables light machine parsing of Markdown summaries per ADR-0001.
 *
 * @param {ExecutionSummary} summary - Summary to convert
 * @returns {string} YAML frontmatter block
 */
export function generateYAMLFrontmatter(summary) {
  const lines = ['---'];
  lines.push(`devCycleId: ${summary.devCycleId}`);
  lines.push(`phase: ${summary.phase}`);
  lines.push(`startTime: ${summary.startTime}`);
  lines.push(`endTime: ${summary.endTime}`);
  lines.push(`status: ${summary.status}`);

  // Format requirement IDs as YAML array
  if (summary.requirementIds && summary.requirementIds.length > 0) {
    lines.push('requirementIds:');
    for (const reqId of summary.requirementIds) {
      lines.push(`  - "${reqId}"`);
    }
  } else {
    lines.push('requirementIds: []');
  }

  // Format checkpoints
  if (summary.checkpoints && summary.checkpoints.length > 0) {
    lines.push('checkpoints:');
    for (const cp of summary.checkpoints) {
      lines.push(`  - id: "${cp.id}"`);
      lines.push(`    approved: ${cp.approved}`);
      if (cp.approver) {
        lines.push(`    approver: "${cp.approver}"`);
      }
    }
  } else {
    lines.push('checkpoints: []');
  }

  // Validation result
  lines.push('validationResult:');
  lines.push(`  passed: ${summary.validationResult.passed}`);
  if (summary.validationResult.details) {
    // Escape multiline details for YAML
    const escapedDetails = summary.validationResult.details.replace(/"/g, '\\"');
    lines.push(`  details: "${escapedDetails}"`);
  }

  // Log file reference
  if (summary.logFile) {
    lines.push(`logFile: "${summary.logFile}"`);
  }

  lines.push('---');
  return lines.join('\n');
}

/**
 * Formats an ExecutionSummary as Markdown with YAML frontmatter.
 * Uses the template from ADR-0001.
 *
 * @param {ExecutionSummary} summary - Summary to format
 * @returns {string} Markdown string with YAML frontmatter
 */
export function formatSummaryAsMarkdown(summary) {
  const lines = [];

  // Add YAML frontmatter for light machine parsing
  lines.push(generateYAMLFrontmatter(summary));
  lines.push('');

  // Title
  lines.push(`# Execution Summary: ${summary.devCycleId}`);
  lines.push('');

  // Metadata
  lines.push(`**Phase:** ${summary.phase}  `);
  lines.push(`**Status:** ${summary.status}  `);
  lines.push(`**Duration:** ${summary.startTime} → ${summary.endTime}`);
  lines.push('');

  // Requirements Addressed
  lines.push('## Requirements Addressed');
  lines.push('');
  if (summary.requirementIds && summary.requirementIds.length > 0) {
    for (const reqId of summary.requirementIds) {
      lines.push(`- ${reqId}`);
    }
  } else {
    lines.push('_No requirement IDs recorded._');
  }
  lines.push('');

  // Checkpoints
  lines.push('## Checkpoints');
  lines.push('');
  if (summary.checkpoints && summary.checkpoints.length > 0) {
    lines.push('| Checkpoint | Approved | Approver |');
    lines.push('| --- | --- | --- |');
    for (const cp of summary.checkpoints) {
      const approved = cp.approved ? '✓' : '✗';
      const approver = cp.approver || '_N/A_';
      lines.push(`| ${cp.id} | ${approved} | ${approver} |`);
    }
  } else {
    lines.push('_No checkpoints recorded._');
  }
  lines.push('');

  // Validation
  lines.push('## Validation');
  lines.push('');
  const validationStatus = summary.validationResult.passed ? '✅ Passed' : '❌ Failed';
  lines.push(validationStatus);
  lines.push('');
  if (summary.validationResult.details) {
    lines.push(summary.validationResult.details);
    lines.push('');
  }

  // Artifacts
  lines.push('## Artifacts');
  lines.push('');
  if (summary.artifacts && summary.artifacts.length > 0) {
    for (const artifact of summary.artifacts) {
      lines.push(`- ${artifact}`);
    }
  } else {
    lines.push('_No artifacts generated._');
  }
  lines.push('');

  // Logs
  lines.push('## Logs');
  lines.push('');
  if (summary.logFile) {
    lines.push(`See [${summary.logFile}](./${summary.logFile})`);
  } else {
    lines.push('_No log file associated._');
  }
  lines.push('');

  // Footer with references
  lines.push('---');
  lines.push('');
  lines.push('_Generated per [TECH §11](../docs/TECH_REQUIREMENTS.md), [SPEC-OBS §2](../spec/observability.spec.md), [ADR-0001](../docs/decisions/ADR-0001-execution-summary-format.md)_');

  return lines.join('\n');
}

/**
 * Writes dual-mode execution summaries (JSON + Markdown) atomically.
 * Creates the summaries directory if it doesn't exist.
 *
 * @param {ExecutionSummary} summary - Summary to write
 * @param {Object} [options] - Write options
 * @param {string} [options.summariesDir] - Custom summaries directory
 * @param {string} [options.timestamp] - Custom timestamp for filenames
 * @param {boolean} [options.validateSchema=true] - Validate schema before writing
 * @returns {SummaryWriteResult} Result of the write operation
 * @see TECH §11.2, ADR-0001
 */
export function writeSummary(summary, options = {}) {
  const {
    summariesDir = DEFAULT_SUMMARIES_DIR,
    timestamp = generateFilenameTimestamp(),
    validateSchema = true,
  } = options;

  const result = {
    success: false,
    timestamp,
  };

  try {
    // Validate schema if requested
    if (validateSchema) {
      const validation = validateSummarySchema(summary);
      if (!validation.valid) {
        return {
          ...result,
          error: `Schema validation failed: ${validation.errors.join('; ')}`,
        };
      }
    }

    // Ensure summaries directory exists
    if (!existsSync(summariesDir)) {
      mkdirSync(summariesDir, { recursive: true });
    }

    // Generate filenames
    const baseFilename = `${summary.devCycleId}-${timestamp}`;
    const jsonPath = path.join(summariesDir, `${baseFilename}.json`);
    const markdownPath = path.join(summariesDir, `${baseFilename}.md`);

    // Format content
    const jsonContent = formatSummaryAsJSON(summary);
    const markdownContent = formatSummaryAsMarkdown(summary);

    // Write files atomically (JSON first, then Markdown)
    writeFileSync(jsonPath, jsonContent, 'utf8');
    writeFileSync(markdownPath, markdownContent, 'utf8');

    return {
      success: true,
      jsonPath,
      markdownPath,
      timestamp,
    };
  } catch (error) {
    return {
      ...result,
      error: error.message,
    };
  }
}

/**
 * Creates an ExecutionSummary from DevCycle execution context.
 * Helper function to construct a valid summary object.
 *
 * @param {Object} context - Execution context
 * @param {string} context.devCycleId - DevCycle identifier
 * @param {string} context.startTime - ISO 8601 start timestamp
 * @param {string} [context.endTime] - ISO 8601 end timestamp (defaults to now)
 * @param {'success'|'failure'|'skipped'} [context.status='success'] - Execution status
 * @param {string[]} [context.requirementIds=[]] - Requirement citations
 * @param {CheckpointApproval[]} [context.checkpoints=[]] - Checkpoint records
 * @param {ValidationResult} [context.validationResult] - Validation summary
 * @param {string[]} [context.artifacts=[]] - Generated artifact paths
 * @param {string} [context.logFile] - Path to NDJSON log file
 * @param {string} [context.phase='reflect'] - Current phase
 * @returns {ExecutionSummary} Constructed summary object
 */
export function createSummary(context) {
  const {
    devCycleId,
    startTime,
    endTime = new Date().toISOString(),
    status = 'success',
    requirementIds = [],
    checkpoints = [],
    validationResult = { passed: true, details: '' },
    artifacts = [],
    logFile,
    phase = 'reflect',
  } = context;

  return {
    devCycleId,
    phase,
    startTime,
    endTime,
    status,
    requirementIds,
    checkpoints,
    validationResult,
    artifacts,
    ...(logFile ? { logFile } : {}),
  };
}

/**
 * Convenience function to create and write a summary in one call.
 *
 * @param {Object} context - Execution context (see createSummary)
 * @param {Object} [options] - Write options (see writeSummary)
 * @returns {SummaryWriteResult} Result of the write operation
 */
export function createAndWriteSummary(context, options = {}) {
  const summary = createSummary(context);
  return writeSummary(summary, options);
}

/** Exported paths for external use */
export { DEFAULT_SUMMARIES_DIR, REPO_ROOT };
