// @ts-nocheck
/**
 * DevCycle Runner Service
 *
 * Integrates the GenAIScript orchestrator with CLI streaming, providing
 * pause/resume checkpoints, approval prompts, and state persistence.
 *
 * @module dist/cli/services/devcycleRunner
 * @see docs/TECH_REQUIREMENTS.md §4.2 - Orchestrator requirements
 * @see docs/PRD.md §5.2 - Retro Console Experience (streaming events)
 * @see spec/engine.spec.md §4 - Execution Guarantees
 * @see spec/cli.spec.md §2 - Interaction & UX Model
 */

import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

import { NDJSONLogger, createLogger } from './ndjsonLogger.js';
import { createFileGuard } from '../security/fileGuard.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..', '..', 'genaiscript');
const ORCHESTRATOR_PATH = path.resolve(GENAI_ROOT, 'orchestrator.genai.js');
const STATE_DIR = path.resolve(GENAI_ROOT, 'state');
const RUNNER_STATE_PATH = path.resolve(STATE_DIR, 'runner-state.json');
const stateFileGuard = createFileGuard();

/**
 * @typedef {Object} RunnerEvent
 * @property {'start'|'phase'|'checkpoint'|'log'|'output'|'error'|'complete'|'firewall'} type
 * @property {string} devCycleId - DevCycle identifier
 * @property {string} [phase] - Current phase name
 * @property {string} [checkpointId] - Checkpoint identifier for checkpoint events
 * @property {string} [message] - Human-readable message
 * @property {Object} [data] - Additional event data
 * @property {string} timestamp - ISO 8601 timestamp
 */

/**
 * @typedef {Object} CheckpointState
 * @property {string} devCycleId - DevCycle that was paused
 * @property {string} phase - Phase where checkpoint occurred
 * @property {string} checkpointId - Checkpoint identifier
 * @property {string} timestamp - When checkpoint was created
 * @property {boolean} approved - Whether checkpoint was approved
 * @property {string} [approver] - Who approved (if applicable)
 * @property {'pending'|'approved'|'rejected'} status
 */

/**
 * @typedef {Object} RunnerState
 * @property {string|null} currentDevCycle - Currently running DevCycle
 * @property {string|null} currentPhase - Current phase
 * @property {'running'|'paused'|'completed'|'failed'|'idle'} status
 * @property {CheckpointState|null} pendingCheckpoint - Checkpoint awaiting approval
 * @property {CheckpointState[]} checkpointHistory - History of checkpoint approvals
 * @property {string} lastUpdated - ISO 8601 timestamp
 */

/**
 * @typedef {Object} RunnerOptions
 * @property {string} devCycleId - DevCycle to run
 * @property {string} [mode] - Execution mode (plan-only, plan-first, execute, validate)
 * @property {string} [task] - Task description
 * @property {boolean} [skipBootstrap] - Skip bootstrap preflight
 * @property {boolean} [autoApprove] - Auto-approve checkpoints (for testing)
 * @property {boolean} [verbose] - Enable verbose logging
 */

/**
 * @typedef {Object} FirewallWarning
 * @property {string} operation - Description of the destructive operation
 * @property {string[]} affectedPaths - Paths that would be affected
 * @property {string[]} rollbackSteps - Steps to rollback if needed
 * @property {string} requirementId - Requirement ID for traceability
 */

/**
 * Gets the default runner state.
 *
 * @returns {RunnerState}
 */
function getDefaultRunnerState() {
  return {
    currentDevCycle: null,
    currentPhase: null,
    status: 'idle',
    pendingCheckpoint: null,
    checkpointHistory: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Loads the runner state from disk.
 *
 * @returns {RunnerState}
 */
function loadRunnerState() {
  if (!existsSync(RUNNER_STATE_PATH)) {
    return getDefaultRunnerState();
  }

  try {
    const raw = readFileSync(RUNNER_STATE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return getDefaultRunnerState();
  }
}

/**
 * Saves the runner state to disk.
 *
 * @param {RunnerState} state
 * @returns {void}
 */
function saveRunnerState(state) {
  if (!existsSync(STATE_DIR)) {
    stateFileGuard.mkdirSync(STATE_DIR, { recursive: true });
  }

  state.lastUpdated = new Date().toISOString();
  const serialized = JSON.stringify(state, null, 2);
  stateFileGuard.writeFileSync(RUNNER_STATE_PATH, serialized, 'utf8');
}

/**
 * DevCycle Runner Service
 *
 * Manages DevCycle execution with streaming output, checkpoints, and approval prompts.
 * Implements TECH §4.2 orchestrator requirements and PRD §5.2 console experience.
 *
 * @extends EventEmitter
 */
export class DevCycleRunner extends EventEmitter {
  /**
   * @param {RunnerOptions} options
   */
  constructor(options) {
    super();
    this.devCycleId = options.devCycleId;
    this.mode = options.mode || 'plan-first';
    this.task = options.task;
    this.skipBootstrap = options.skipBootstrap || false;
    this.autoApprove = options.autoApprove || false;
    this.verbose = options.verbose || false;

    this.state = loadRunnerState();
    this.logger = createLogger({
      devCycleId: this.devCycleId,
      includeConsole: this.verbose,
    });
    this.process = null;
    this.isPaused = false;
    this.readline = null;
  }

  /**
   * Emits a runner event and logs it.
   *
   * @param {RunnerEvent} event
   * @returns {void}
   */
  _emitEvent(event) {
    const fullEvent = {
      ...event,
      devCycleId: this.devCycleId,
      timestamp: new Date().toISOString(),
    };

    this.emit('event', fullEvent);
    this.emit(event.type, fullEvent);

    // Log to NDJSON
    this.logger.log({
      phase: event.phase || 'system',
      message: event.message || `Event: ${event.type}`,
      severity: event.type === 'error' ? 'error' : 'info',
      data: event.data,
    });
  }

  /**
   * Prompts user for checkpoint approval via stdin.
   * Implements PRD §5.2 approval prompts requirement.
   *
   * @param {string} checkpointId - Checkpoint identifier
   * @param {string} message - Prompt message
   * @returns {Promise<boolean>} - Whether approved
   */
  async _promptForApproval(checkpointId, message) {
    if (this.autoApprove) {
      this.logger.checkpoint(this.state.currentPhase, checkpointId, true, 'auto');
      return true;
    }

    return new Promise((resolve) => {
      this.readline = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      console.log('\n' + '═'.repeat(60));
      console.log('🔒 CHECKPOINT APPROVAL REQUIRED');
      console.log('═'.repeat(60));
      console.log(`\nPhase: ${this.state.currentPhase}`);
      console.log(`Checkpoint: ${checkpointId}`);
      console.log(`\n${message}`);
      console.log('\n' + '─'.repeat(60));

      this.readline.question('\nApprove this checkpoint? (y/n): ', (answer) => {
        this.readline.close();
        this.readline = null;

        const approved = answer.toLowerCase().startsWith('y');
        this.logger.checkpoint(this.state.currentPhase, checkpointId, approved, 'user');

        if (approved) {
          console.log('✅ Checkpoint approved. Continuing...\n');
        } else {
          console.log('❌ Checkpoint rejected. Pausing execution.\n');
        }

        resolve(approved);
      });
    });
  }

  /**
   * Displays Bad Vibes Firewall warning for destructive operations.
   * Implements PRD §5.5 and SPEC-SECURITY §1 requirements.
   *
   * @param {FirewallWarning} warning
   * @returns {Promise<boolean>} - Whether to proceed
   */
  async _showFirewallWarning(warning) {
    this._emitEvent({
      type: 'firewall',
      phase: this.state.currentPhase,
      message: `Bad Vibes Firewall: ${warning.operation}`,
      data: warning,
    });

    console.log('\n' + '🔥'.repeat(30));
    console.log('⚠️  BAD VIBES FIREWALL WARNING ⚠️');
    console.log('🔥'.repeat(30));
    console.log(`\nOperation: ${warning.operation}`);
    console.log(`\nAffected Paths:`);
    warning.affectedPaths.forEach((p) => console.log(`  • ${p}`));
    console.log(`\nRollback Steps:`);
    warning.rollbackSteps.forEach((step, i) => console.log(`  ${i + 1}. ${step}`));
    console.log(`\nRequirement: ${warning.requirementId}`);
    console.log('\n' + '─'.repeat(60));

    return this._promptForApproval(
      'firewall-approval',
      'Do you want to proceed with this destructive operation?'
    );
  }

  /**
   * Handles checkpoint events from orchestrator output.
   * Implements pause/resume functionality per TECH §4.2.
   *
   * @param {string} line - Output line containing checkpoint info
   * @returns {Promise<void>}
   */
  async _handleCheckpoint(line) {
    // Parse checkpoint from orchestrator output
    // Expected format: CHECKPOINT:<id>:<phase>:<message>
    // Allow flexible identifiers with hyphens, underscores, and alphanumeric chars
    const match = line.match(/CHECKPOINT:([a-zA-Z0-9_-]+):([a-zA-Z0-9_-]+):(.+)/);
    if (!match) return;

    const [, checkpointId, phase, message] = match;

    this.state.currentPhase = phase;
    this.state.status = 'paused';
    this.state.pendingCheckpoint = {
      devCycleId: this.devCycleId,
      phase,
      checkpointId,
      timestamp: new Date().toISOString(),
      approved: false,
      status: 'pending',
    };

    saveRunnerState(this.state);
    this.isPaused = true;

    this._emitEvent({
      type: 'checkpoint',
      phase,
      checkpointId,
      message: `Checkpoint reached: ${checkpointId}`,
      data: { message },
    });

    const approved = await this._promptForApproval(checkpointId, message);

    this.state.pendingCheckpoint.approved = approved;
    this.state.pendingCheckpoint.status = approved ? 'approved' : 'rejected';
    this.state.checkpointHistory.push({ ...this.state.pendingCheckpoint });
    this.state.pendingCheckpoint = null;

    if (approved) {
      this.state.status = 'running';
      this.isPaused = false;
    } else {
      this.state.status = 'paused';
    }

    saveRunnerState(this.state);
  }

  /**
   * Handles firewall warning events from orchestrator output.
   *
   * @param {string} line - Output line containing firewall info
   * @returns {Promise<boolean>} - Whether to proceed
   */
  async _handleFirewallWarning(line) {
    // Parse firewall warning using JSON format for robustness
    // Expected format: FIREWALL_JSON:<base64-encoded-json>
    // Fallback format: FIREWALL:<operation>||<paths>||<rollback>||<requirementId>
    // Using double-pipe as delimiter to reduce collision with single pipes in content

    // Try JSON format first (preferred)
    const jsonMatch = line.match(/FIREWALL_JSON:(.+)/);
    if (jsonMatch) {
      try {
        const decoded = Buffer.from(jsonMatch[1], 'base64').toString('utf8');
        const warning = JSON.parse(decoded);
        return this._showFirewallWarning(warning);
      } catch {
        // Fall through to legacy format
      }
    }

    // Legacy pipe-delimited format (use double-pipe for safety)
    const match = line.match(/FIREWALL:(.+?)\|\|(.+?)\|\|(.+?)\|\|(.+)/);
    if (!match) return true;

    const [, operation, pathsStr, rollbackStr, requirementId] = match;

    /** @type {FirewallWarning} */
    const warning = {
      operation,
      affectedPaths: pathsStr.split(',').map((p) => p.trim()),
      rollbackSteps: rollbackStr.split(',').map((s) => s.trim()),
      requirementId,
    };

    return this._showFirewallWarning(warning);
  }

  /**
   * Parses orchestrator output line and emits appropriate events.
   *
   * @param {string} line - Raw output line
   * @returns {Promise<void>}
   */
  async _processOutputLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check for checkpoint markers
    if (trimmed.startsWith('CHECKPOINT:')) {
      await this._handleCheckpoint(trimmed);
      return;
    }

    // Check for firewall warnings (both JSON and legacy formats)
    if (trimmed.startsWith('FIREWALL:') || trimmed.startsWith('FIREWALL_JSON:')) {
      const proceed = await this._handleFirewallWarning(trimmed);
      if (!proceed) {
        this._emitEvent({
          type: 'error',
          message: 'Operation cancelled by user (firewall rejection)',
        });
        this.stop();
      }
      return;
    }

    // Check for structured phase marker (preferred)
    // Format: PHASE:<phase-name> or PHASE_ENTER:<phase-name>
    const structuredPhaseMatch = trimmed.match(/^PHASE(?:_ENTER)?:([a-zA-Z0-9_-]+)/);
    if (structuredPhaseMatch) {
      this.state.currentPhase = structuredPhaseMatch[1];
      this._emitEvent({
        type: 'phase',
        phase: structuredPhaseMatch[1],
        message: `Entered phase: ${structuredPhaseMatch[1]}`,
      });
      return;
    }

    // Fallback: Check for phase transitions from orchestrator output
    // This pattern matches the current orchestrator format but may change
    const legacyPhaseMatch = trimmed.match(
      /Context Hydrated for DevCycle.*\(SPEC-ENGINE §4\)\s+(.+)/
    );
    if (legacyPhaseMatch) {
      this.state.currentPhase = legacyPhaseMatch[1];
      this._emitEvent({
        type: 'phase',
        phase: legacyPhaseMatch[1],
        message: `Entered phase: ${legacyPhaseMatch[1]}`,
      });
      return;
    }

    // Check for completion
    if (trimmed.includes('✅ DevCycle complete') || trimmed.startsWith('DEVCYCLE_COMPLETE')) {
      this._emitEvent({
        type: 'complete',
        message: 'DevCycle completed successfully',
        data: { devCycleId: this.devCycleId },
      });
      return;
    }

    // Check for errors
    if (trimmed.toLowerCase().includes('error') || trimmed.startsWith('❌')) {
      this._emitEvent({
        type: 'error',
        message: trimmed,
      });
      return;
    }

    // Standard output
    this._emitEvent({
      type: 'output',
      message: trimmed,
    });
  }

  /**
   * Starts the DevCycle execution.
   * Implements streaming via Node streams per TECH §4.2 and PRD §5.2.
   *
   * @returns {Promise<void>}
   */
  async run() {
    // Update state
    this.state.currentDevCycle = this.devCycleId;
    this.state.status = 'running';
    this.state.currentPhase = null;
    saveRunnerState(this.state);

    // Initialize logger
    this.logger.info('system', `Starting DevCycle: ${this.devCycleId}`, {
      mode: this.mode,
      task: this.task,
      skipBootstrap: this.skipBootstrap,
    });
    this.logger.requirement('system', 'TECH §4.2', 'Orchestrator invocation with streaming');

    this._emitEvent({
      type: 'start',
      message: `Starting DevCycle: ${this.devCycleId}`,
      data: {
        mode: this.mode,
        task: this.task,
        orchestratorPath: ORCHESTRATOR_PATH,
      },
    });

    // Build command arguments
    // Note: The orchestrator expects 'phase' parameter for the DevCycle to run
    // (per orchestrator.genai.js parameters.phase), so we pass devCycleId as phase
    const args = [
      'genaiscript',
      'run',
      ORCHESTRATOR_PATH,
      '--vars',
      `phase=${this.devCycleId}`, // devCycleId maps to orchestrator's phase parameter
      '--vars',
      `mode=${this.mode}`,
    ];

    if (this.task) {
      args.push('--vars', `task=${this.task}`);
    }

    if (this.skipBootstrap) {
      args.push('--vars', 'skipBootstrap=true');
    }

    return new Promise((resolve, reject) => {
      this.process = spawn('npx', args, {
        cwd: path.resolve(CURRENT_DIR, '..', '..', '..'),
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Stream stdout
      this.process.stdout.on('data', async (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          await this._processOutputLine(line);
        }
      });

      // Stream stderr
      this.process.stderr.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
          this._emitEvent({
            type: 'log',
            message,
            data: { stream: 'stderr' },
          });
        }
      });

      this.process.on('close', async (code) => {
        this.state.status = code === 0 ? 'completed' : 'failed';
        saveRunnerState(this.state);

        await this.logger.close();

        if (code === 0) {
          this._emitEvent({
            type: 'complete',
            message: `DevCycle ${this.devCycleId} completed successfully`,
            data: { exitCode: code, logFile: this.logger.getLogFilePath() },
          });
          resolve();
        } else {
          this._emitEvent({
            type: 'error',
            message: `DevCycle ${this.devCycleId} failed with exit code ${code}`,
            data: { exitCode: code, logFile: this.logger.getLogFilePath() },
          });
          reject(new Error(`DevCycle failed with exit code ${code}`));
        }
      });

      this.process.on('error', async (err) => {
        this.state.status = 'failed';
        saveRunnerState(this.state);

        this._emitEvent({
          type: 'error',
          message: `Process error: ${err.message}`,
          data: { error: err.message },
        });

        await this.logger.close();
        reject(err);
      });
    });
  }

  /**
   * Stops the current DevCycle execution.
   *
   * @returns {void}
   */
  stop() {
    if (this.process) {
      this.process.kill('SIGTERM');
      this.process = null;
    }

    if (this.readline) {
      this.readline.close();
      this.readline = null;
    }

    this.state.status = 'paused';
    saveRunnerState(this.state);

    this._emitEvent({
      type: 'log',
      message: 'DevCycle execution stopped',
    });
  }

  /**
   * Resumes a paused DevCycle from the last checkpoint.
   *
   * @returns {Promise<void>}
   */
  async resume() {
    const state = loadRunnerState();

    if (state.status !== 'paused' || !state.currentDevCycle) {
      throw new Error('No paused DevCycle to resume');
    }

    this.devCycleId = state.currentDevCycle;
    this.isPaused = false;

    this.logger.info('system', `Resuming DevCycle: ${this.devCycleId}`, {
      fromPhase: state.currentPhase,
    });

    return this.run();
  }

  /**
   * Gets the current runner state.
   *
   * @returns {RunnerState}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Gets the log file path.
   *
   * @returns {string|null}
   */
  getLogFilePath() {
    return this.logger.getLogFilePath();
  }
}

/**
 * Creates a new DevCycle runner instance.
 *
 * @param {RunnerOptions} options
 * @returns {DevCycleRunner}
 */
export function createRunner(options) {
  return new DevCycleRunner(options);
}

/**
 * Runs a DevCycle with streaming output.
 * Convenience function for simple execution.
 *
 * @param {string} devCycleId - DevCycle to run
 * @param {Partial<RunnerOptions>} [options] - Additional options
 * @returns {Promise<void>}
 */
export async function runDevCycle(devCycleId, options = {}) {
  const runner = createRunner({ devCycleId, ...options });

  runner.on('event', (event) => {
    if (event.type === 'output' || event.type === 'log') {
      console.log(event.message);
    }
  });

  return runner.run();
}

/**
 * Gets the current runner state.
 *
 * @returns {RunnerState}
 */
export function getRunnerState() {
  return loadRunnerState();
}

/**
 * Checks if a DevCycle is currently paused and can be resumed.
 *
 * @returns {boolean}
 */
export function canResume() {
  const state = loadRunnerState();
  return state.status === 'paused' && state.currentDevCycle !== null;
}

export { loadRunnerState, saveRunnerState, getDefaultRunnerState, RUNNER_STATE_PATH };
