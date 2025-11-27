// @ts-nocheck
/**
 * Loaded Vibes Doctor Command
 *
 * Scans prerequisites, MCP availability, file permissions, and manifest drift.
 * Emits NDJSON logs per step and offers optional remediation with confirmation.
 *
 * @module dist/cli/commands/doctor
 * @see PRD §5.4 - Observability & Reporting
 * @see TECH_REQUIREMENTS §5.3 - Diagnostics & Logs
 */

import { access, copyFile, mkdir, readFile } from 'fs/promises';
import { constants as fsConstants, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { spawnSync } from 'child_process';
import {
  runPreflightChecks,
  formatResults as formatPreflightResults,
} from '../preflight/index.js';
import { createLogger } from '../services/ndjsonLogger.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PHASE = 'doctor';
const REQUIREMENT_ID = 'PRD §5.4';
const TECH_REF = 'TECH §5.3';
const DEFAULT_TIMEOUT_MS = 60000;

/**
 * Resolves key paths used by doctor checks.
 * @param {string} [cwd]
 * @returns {Object}
 */
function resolvePaths(cwd = process.cwd()) {
  const shippedRoot = path.resolve(CURRENT_DIR, '..', '..');
  const installedRoot = path.resolve(cwd, '.loaded-vibes');

  return {
    shippedRoot,
    installedRoot,
    shippedManifest: path.join(shippedRoot, 'genaiscript', 'devcycles.config.json'),
    installedManifest: path.join(installedRoot, 'genaiscript', 'devcycles.config.json'),
    shippedMcp: path.join(shippedRoot, '.vscode', 'mcp.json'),
    installedMcp: path.join(installedRoot, '.vscode', 'mcp.json'),
    shippedGenaiRoot: path.join(shippedRoot, 'genaiscript'),
    installedGenaiRoot: path.join(installedRoot, 'genaiscript'),
  };
}

/**
 * Safely reads and parses JSON from a file.
 * @param {string} filePath
 * @returns {Promise<{exists: boolean, data: any, error?: string}>}
 */
async function readJson(filePath) {
  if (!existsSync(filePath)) {
    return { exists: false, data: null, error: 'File not found' };
  }

  try {
    const content = await readFile(filePath, 'utf8');
    return { exists: true, data: JSON.parse(content) };
  } catch (err) {
    return { exists: true, data: null, error: err.message };
  }
}

/**
 * Normalizes an object by sorting keys to enable deterministic comparisons.
 * @param {any} value
 * @returns {any}
 */
function normalizeObject(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeObject);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = normalizeObject(value[key]);
        return acc;
      }, {});
  }

  return value;
}

/**
 * Checks whether a command exists on the system PATH.
 * @param {string} command
 * @returns {boolean}
 */
function commandExists(command) {
  const result = spawnSync(command, ['--version'], {
    shell: true,
    timeout: 4000,
    stdio: 'ignore',
  });
  return result.status === 0;
}

/**
 * Validates manifest file references exist relative to a base directory.
 * @param {Object} manifest
 * @param {string} baseDir
 * @returns {string[]}
 */
function validateManifestPaths(manifest, baseDir) {
  if (!manifest) return ['Manifest is empty'];

  const issues = [];
  for (const [key, entry] of Object.entries(manifest)) {
    ['instructions', 'prompt', 'toolset'].forEach((field) => {
      if (entry[field]) {
        const resolved = path.resolve(baseDir, entry[field]);
        if (!existsSync(resolved)) {
          issues.push(`DevCycle "${key}" missing ${field}: ${entry[field]}`);
        }
      } else {
        issues.push(`DevCycle "${key}" missing required field: ${field}`);
      }
    });
  }

  return issues;
}

/**
 * Prompts the user for a yes/no answer.
 * @param {string} question
 * @param {boolean} autoApprove
 * @returns {Promise<boolean>}
 */
async function promptYesNo(question, autoApprove = false) {
  if (autoApprove) return true;
  if (!process.stdin.isTTY) return false;

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase().startsWith('y'));
    });
  });
}

/**
 * Runs preflight checks and logs output.
 * @param {NDJSONLogger} logger
 * @returns {Promise<Object>}
 */
async function runPreflight(logger) {
  logger.info(PHASE, 'Running preflight checks');
  const result = await runPreflightChecks();
  logger.requirement(PHASE, REQUIREMENT_ID, 'Preflight checks complete');
  logger.info(PHASE, 'Preflight summary', {
    passed: result.passedCount,
    failed: result.failedCount,
  });
  return {
    name: 'Prerequisites',
    passed: result.success,
    details: formatPreflightResults(result),
    remediation: 'See above remediation steps for any failed prerequisite.',
  };
}

/**
 * Checks MCP configuration and availability.
 * @param {NDJSONLogger} logger
 * @param {Object} paths
 * @param {Array} remediations
 * @returns {Promise<Object>}
 */
async function checkMcp(logger, paths, remediations) {
  const configPath = existsSync(paths.installedMcp) ? paths.installedMcp : paths.shippedMcp;
  const usingInstalled = existsSync(paths.installedMcp);

  if (!existsSync(configPath)) {
    const message = 'No MCP configuration found in .loaded-vibes/.vscode/mcp.json';
    logger.warn(PHASE, message);

    if (existsSync(paths.shippedMcp)) {
      remediations.push({
        description: 'Copy shipped MCP config into .loaded-vibes/.vscode',
        action: async () => {
          await mkdir(path.dirname(paths.installedMcp), { recursive: true });
          await copyFile(paths.shippedMcp, paths.installedMcp);
        },
      });
    }

    return {
      name: 'MCP endpoints',
      passed: false,
      details: message,
      remediation: 'Copy the shipped mcp.json into .loaded-vibes/.vscode or provide a project-specific MCP configuration.',
    };
  }

  const result = await readJson(configPath);
  if (!result.data) {
    const message = `Failed to parse MCP config: ${result.error}`;
    logger.error(PHASE, message);
    return {
      name: 'MCP endpoints',
      passed: false,
      details: message,
      remediation: 'Fix JSON syntax in mcp.json.',
    };
  }

  const servers = result.data.mcpServers || {};
  const issues = [];
  const availability = [];

  for (const [name, server] of Object.entries(servers)) {
    if (!server.command) {
      issues.push(`Server "${name}" is missing a command.`);
      continue;
    }

    const hasCommand = commandExists(server.command);
    if (!hasCommand) {
      issues.push(`Command "${server.command}" for server "${name}" is not available on PATH.`);
    } else {
      availability.push(name);
    }

    if (server.env) {
      for (const [key, value] of Object.entries(server.env)) {
        if (typeof value === 'string' && value.includes('<YOUR_')) {
          issues.push(`Server "${name}" env "${key}" still uses placeholder value.`);
        }
      }
    }
  }

  const passed = issues.length === 0;
  if (passed) {
    logger.info(PHASE, 'MCP configuration validated', {
      source: usingInstalled ? 'installed' : 'shipped',
      servers: availability,
    });
  } else {
    logger.warn(PHASE, 'MCP configuration issues detected', { issues });
  }

  if (!usingInstalled && existsSync(paths.shippedMcp)) {
    remediations.push({
      description: 'Copy shipped MCP config into .loaded-vibes/.vscode',
      action: async () => {
        await mkdir(path.dirname(paths.installedMcp), { recursive: true });
        await copyFile(paths.shippedMcp, paths.installedMcp);
      },
    });
  }

  return {
    name: 'MCP endpoints',
    passed,
    details: passed
      ? `MCP config loaded from ${usingInstalled ? 'project .loaded-vibes/.vscode' : 'shipped .vscode'}`
      : `Issues: ${issues.join(' | ')}`,
    remediation: 'Ensure MCP servers have valid commands and no placeholder env vars. Install required server packages or update PATH.',
  };
}

/**
 * Checks file permissions for .loaded-vibes assets.
 * @param {NDJSONLogger} logger
 * @param {Object} paths
 * @param {Array} remediations
 * @returns {Promise<Object>}
 */
async function checkPermissions(logger, paths, remediations) {
  const targets = [
    paths.installedRoot,
    path.join(paths.installedRoot, 'logs'),
    path.join(paths.installedRoot, 'genaiscript'),
    path.join(paths.installedRoot, '.vscode'),
  ];

  const issues = [];

  for (const target of targets) {
    if (!existsSync(target)) {
      issues.push(`Missing: ${target}`);
      remediations.push({
        description: `Create ${target}`,
        action: async () => {
          await mkdir(target, { recursive: true });
        },
      });
      continue;
    }

    try {
      await access(target, fsConstants.R_OK | fsConstants.W_OK);
    } catch {
      issues.push(`No read/write access: ${target}`);
    }
  }

  const passed = issues.length === 0;
  if (passed) {
    logger.info(PHASE, 'File permission check passed');
  } else {
    logger.warn(PHASE, 'File permission issues', { issues });
  }

  return {
    name: 'File permissions',
    passed,
    details: passed ? 'All .loaded-vibes paths are accessible.' : `Issues: ${issues.join(' | ')}`,
    remediation: 'Ensure .loaded-vibes and subfolders are present with read/write permissions.',
  };
}

/**
 * Checks manifest drift between shipped and installed manifests.
 * @param {NDJSONLogger} logger
 * @param {Object} paths
 * @param {Array} remediations
 * @returns {Promise<Object>}
 */
async function checkManifest(logger, paths, remediations) {
  const shipped = await readJson(paths.shippedManifest);
  const installed = await readJson(paths.installedManifest);

  if (!shipped.exists) {
    const message = 'Shipped manifest not found; cannot compare drift.';
    logger.warn(PHASE, message);
    return {
      name: 'Manifest drift',
      passed: false,
      details: message,
      remediation: 'Regenerate shipped assets or reinstall the CLI package.',
    };
  }

  if (!installed.exists) {
    const message = 'Installed manifest missing from .loaded-vibes.';
    logger.warn(PHASE, message);
    remediations.push({
      description: 'Copy shipped manifest into .loaded-vibes/genaiscript',
      action: async () => {
        await mkdir(path.dirname(paths.installedManifest), { recursive: true });
        await copyFile(paths.shippedManifest, paths.installedManifest);
      },
    });

    return {
      name: 'Manifest drift',
      passed: false,
      details: message,
      remediation: 'Copy the shipped manifest into .loaded-vibes to restore parity.',
    };
  }

  if (!installed.data) {
    const message = `Installed manifest invalid: ${installed.error}`;
    logger.warn(PHASE, message);
    remediations.push({
      description: 'Replace invalid manifest with shipped version',
      action: async () => {
        await mkdir(path.dirname(paths.installedManifest), { recursive: true });
        await copyFile(paths.shippedManifest, paths.installedManifest);
      },
    });

    return {
      name: 'Manifest drift',
      passed: false,
      details: message,
      remediation: 'Replace invalid manifest with the shipped copy.',
    };
  }

  const shippedNormalized = JSON.stringify(normalizeObject(shipped.data));
  const installedNormalized = JSON.stringify(normalizeObject(installed.data));
  const drift = shippedNormalized !== installedNormalized;

  const pathIssues = validateManifestPaths(installed.data, paths.installedGenaiRoot);
  const shippedPathIssues = validateManifestPaths(shipped.data, paths.shippedGenaiRoot);
  const allIssues = [...pathIssues, ...shippedPathIssues];

  if (drift) {
    allIssues.push('Manifest content differs from shipped version.');
    remediations.push({
      description: 'Sync manifest from shipped assets into .loaded-vibes',
      action: async () => {
        await mkdir(path.dirname(paths.installedManifest), { recursive: true });
        await copyFile(paths.shippedManifest, paths.installedManifest);
      },
    });
  }

  const passed = !drift && allIssues.length === 0;
  if (passed) {
    logger.info(PHASE, 'Manifest matches shipped version');
  } else {
    logger.warn(PHASE, 'Manifest drift detected', { drift, issues: allIssues });
  }

  return {
    name: 'Manifest drift',
    passed,
    details: passed ? 'Manifest matches shipped version and references resolve.' : `Issues: ${allIssues.join(' | ')}`,
    remediation: 'Restore the manifest from shipped assets or fix referenced file paths.',
  };
}

/**
 * Applies remediation actions with user confirmation.
 * @param {Array} remediations
 * @param {NDJSONLogger} logger
 * @param {boolean} autoApprove
 * @returns {Promise<void>}
 */
async function applyRemediations(remediations, logger, autoApprove) {
  for (const remediation of remediations) {
    const approved = await promptYesNo(remediation.description, autoApprove);
    if (!approved) {
      logger.warn(PHASE, 'Remediation skipped', { remediation: remediation.description });
      continue;
    }

    try {
      await remediation.action();
      logger.info(PHASE, 'Remediation applied', { remediation: remediation.description });
    } catch (err) {
      logger.error(PHASE, 'Remediation failed', { remediation: remediation.description, error: err.message });
    }
  }
}

/**
 * Formats doctor results for console output.
 * @param {Array} results
 * @param {number} durationMs
 * @returns {string}
 */
function formatDoctorResults(results, durationMs) {
  const lines = [];
  lines.push('');
  lines.push('============================================================');
  lines.push('                  LOADED VIBES DOCTOR');
  lines.push('============================================================');

  for (const result of results) {
    const icon = result.passed ? '[OK ]' : '[WARN]';
    lines.push(`${icon} ${result.name}`);
    if (result.details) {
      String(result.details)
        .split('\n')
        .forEach((detailLine) => {
          if (detailLine.trim().length > 0) {
            lines.push(`      ${detailLine}`);
          }
        });
    }
    if (!result.passed && result.remediation) {
      lines.push(`      Remediation: ${result.remediation}`);
    }
    lines.push('');
  }

  const failures = results.filter((r) => !r.passed).length;
  lines.push(`Summary: ${results.length - failures}/${results.length} checks passed.`);
  lines.push(`Duration: ${Math.round(durationMs)} ms`);
  lines.push('References: PRD §5.4, TECH_REQUIREMENTS §5.3');
  lines.push('');
  return lines.join('\n');
}

/**
 * Runs doctor diagnostics programmatically.
 * @param {Object} [options]
 * @returns {Promise<{results: any[], durationMs: number, exitCode: number}>}
 */
export async function runDoctor(options = {}) {
  const started = Date.now();
  const logger = createLogger({
    devCycleId: options.devCycleId || 'doctor',
    includeConsole: options.verbose || false,
  });

  const remediations = [];
  const paths = resolvePaths(options.cwd);
  const results = [];

  logger.requirement(PHASE, REQUIREMENT_ID, 'Starting doctor diagnostics');
  logger.info(PHASE, 'Scanning workspace', { cwd: options.cwd || process.cwd(), refs: [REQUIREMENT_ID, TECH_REF] });

  try {
    results.push(await runPreflight(logger));
    results.push(await checkMcp(logger, paths, remediations));
    results.push(await checkPermissions(logger, paths, remediations));
    results.push(await checkManifest(logger, paths, remediations));

    await applyRemediations(remediations, logger, options.autoApprove);
  } catch (err) {
    logger.error(PHASE, 'Doctor run failed', { error: err.message });
    results.push({
      name: 'Doctor runtime',
      passed: false,
      details: err.message,
      remediation: 'Inspect stack trace and rerun with verbose logging.',
    });
  } finally {
    await logger.close();
  }

  const durationMs = Date.now() - started;
  const exitCode = results.some((r) => !r.passed) ? 1 : 0;
  return { results, durationMs, exitCode };
}

/**
 * CLI entry point for doctor command.
 * @returns {Promise<void>}
 */
export async function runDoctorCli() {
  const args = process.argv.slice(2).filter((arg) => arg !== 'doctor');
  const autoApprove = args.includes('--yes') || args.includes('-y');
  const verbose = args.includes('--verbose');

  const { results, durationMs, exitCode } = await runDoctor({ autoApprove, verbose });
  console.log(formatDoctorResults(results, durationMs));

  if (durationMs > DEFAULT_TIMEOUT_MS) {
    console.warn('Doctor exceeded 60s budget; review long-running checks.');
  }

  process.exit(exitCode);
}

/**
 * Detect direct execution.
 * @returns {boolean}
 */
function isRunningDirectly() {
  if (!process.argv[1]) return false;
  const scriptPath = fileURLToPath(import.meta.url);
  return path.resolve(process.argv[1]) === scriptPath;
}

if (isRunningDirectly()) {
  runDoctorCli().catch((err) => {
    console.error('Doctor command failed:', err);
    process.exit(1);
  });
}
