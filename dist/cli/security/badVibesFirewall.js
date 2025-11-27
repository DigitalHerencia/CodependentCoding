// @ts-nocheck
/**
 * Bad Vibes Firewall
 *
 * Implements PRD §5.5 and SPEC-SECURITY §1 requirements for destructive operation warnings.
 * Provides interactive prompts summarizing risk, required approvals, and rollback steps.
 * Records approvals (user name/time) to NDJSON logs and state JSON.
 *
 * @module dist/cli/security/badVibesFirewall
 * @see docs/PRD.md §5.5 - Security & Risk Controls
 * @see spec/security.spec.md §1 - Policies (Bad Vibes Firewall)
 * @see docs/TECH_REQUIREMENTS.md §5.4 - Security & Performance
 *
 * Closes #23.
 */

import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_STATE_DIR = path.resolve(CURRENT_DIR, '..', '..', '..', '.loaded-vibes', 'genaiscript', 'state');
const DEFAULT_LOGS_DIR = path.resolve(CURRENT_DIR, '..', '..', '..', '.loaded-vibes', 'logs');

const REQUIREMENT_ID = 'PRD §5.5 / SPEC-SECURITY §1';
const FIREWALL_LABEL = '⚠️  BAD VIBES FIREWALL';
const STATE_FILE = 'firewall-approvals.json';
const LOG_FILE = 'firewall.ndjson';
const MAX_STATE_RECORDS = 500;

/**
 * Action descriptor for a destructive operation.
 * @typedef {Object} ActionDescriptor
 * @property {string} operation - Human-readable description of the operation
 * @property {string[]} affectedPaths - File/directory paths that would be affected
 * @property {string[]} requiredApprovals - List of required approval types (e.g., ['user', 'admin'])
 * @property {string[]} rollbackSteps - Ordered steps to rollback the operation if needed
 * @property {'low'|'medium'|'high'|'critical'} riskLevel - Risk severity level
 * @property {string} [devCycleId] - DevCycle that triggered this action
 * @property {string} [phase] - Phase within the DevCycle
 * @property {string} [requirementId] - Optional specific requirement reference
 */

/**
 * Approval record stored in logs/state.
 * @typedef {Object} ApprovalRecord
 * @property {string} operation - Description of the operation
 * @property {string[]} affectedPaths - Affected paths
 * @property {boolean} approved - Whether the operation was approved
 * @property {string} approver - Who approved (user identifier or 'auto')
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {string} requirementId - Requirement reference
 * @property {'low'|'medium'|'high'|'critical'} riskLevel - Risk level
 * @property {string} [devCycleId] - DevCycle context
 * @property {string} [phase] - Phase context
 * @property {string[]} rollbackSteps - Rollback instructions
 */

/**
 * Firewall options.
 * @typedef {Object} FirewallOptions
 * @property {boolean} [autoApprove] - Auto-approve all operations (for testing)
 * @property {string} [stateDir] - Directory for state persistence
 * @property {string} [logsDir] - Directory for NDJSON logs
 * @property {Function} [promptHandler] - Custom prompt handler (for testing)
 * @property {Object} [logger] - External logger instance
 */

/**
 * Firewall result.
 * @typedef {Object} FirewallResult
 * @property {boolean} approved - Whether the operation was approved
 * @property {string} approver - Who approved
 * @property {string} timestamp - Approval timestamp
 * @property {string} reason - Reason for approval/denial
 */

/**
 * Gets the risk level emoji and color label.
 *
 * @param {'low'|'medium'|'high'|'critical'} riskLevel
 * @returns {{ emoji: string, label: string }}
 */
function getRiskDisplay(riskLevel) {
  switch (riskLevel) {
    case 'critical':
      return { emoji: '🔴', label: 'CRITICAL' };
    case 'high':
      return { emoji: '🟠', label: 'HIGH' };
    case 'medium':
      return { emoji: '🟡', label: 'MEDIUM' };
    case 'low':
    default:
      return { emoji: '🟢', label: 'LOW' };
  }
}

/**
 * Formats the firewall prompt summary.
 *
 * @param {ActionDescriptor} action
 * @returns {string}
 */
function formatFirewallSummary(action) {
  const { emoji, label } = getRiskDisplay(action.riskLevel);
  const lines = [];

  lines.push('');
  lines.push('🔥'.repeat(30));
  lines.push(`${FIREWALL_LABEL} 🔥`);
  lines.push('🔥'.repeat(30));
  lines.push('');
  lines.push(`Risk Level: ${emoji} ${label}`);
  lines.push('');
  lines.push(`Operation: ${action.operation}`);
  lines.push('');

  if (action.devCycleId) {
    lines.push(`DevCycle: ${action.devCycleId}`);
  }
  if (action.phase) {
    lines.push(`Phase: ${action.phase}`);
  }

  lines.push('');
  lines.push('═'.repeat(60));
  lines.push('AFFECTED PATHS:');
  lines.push('═'.repeat(60));
  if (action.affectedPaths.length === 0) {
    lines.push('  (none specified)');
  } else {
    action.affectedPaths.forEach((p) => {
      lines.push(`  • ${p}`);
    });
  }

  lines.push('');
  lines.push('─'.repeat(60));
  lines.push('REQUIRED APPROVALS:');
  lines.push('─'.repeat(60));
  if (action.requiredApprovals.length === 0) {
    lines.push('  • user confirmation');
  } else {
    action.requiredApprovals.forEach((approval) => {
      lines.push(`  • ${approval}`);
    });
  }

  lines.push('');
  lines.push('─'.repeat(60));
  lines.push('ROLLBACK STEPS (if operation fails or needs reversal):');
  lines.push('─'.repeat(60));
  if (action.rollbackSteps.length === 0) {
    lines.push('  1. Manual intervention required - no automatic rollback available');
  } else {
    action.rollbackSteps.forEach((step, i) => {
      lines.push(`  ${i + 1}. ${step}`);
    });
  }

  lines.push('');
  lines.push('─'.repeat(60));
  lines.push(`Requirement: ${action.requirementId || REQUIREMENT_ID}`);
  lines.push('─'.repeat(60));

  return lines.join('\n');
}

/**
 * Default prompt handler for interactive approval.
 *
 * @param {ActionDescriptor} action
 * @returns {Promise<{ approved: boolean, approver: string }>}
 */
async function defaultPromptHandler(action) {
  const summary = formatFirewallSummary(action);

  if (!process.stdin.isTTY) {
    console.warn(`${FIREWALL_LABEL}: non-interactive shell detected; rejecting by default.`);
    return { approved: false, approver: 'system' };
  }

  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    console.log(summary);
    console.log('');

    rl.question('Proceed with this destructive operation? (y/N): ', (answer) => {
      const approved = answer.trim().toLowerCase().startsWith('y');

      if (approved) {
        rl.question('Enter your name for approval record (or press Enter for "user"): ', (name) => {
          rl.close();
          const approver = name.trim() || 'user';
          console.log('');
          console.log(`✅ Operation approved by ${approver}. Proceeding...`);
          console.log('');
          resolve({ approved: true, approver });
        });
      } else {
        rl.close();
        console.log('');
        console.log('❌ Operation denied. Aborting.');
        console.log('');
        resolve({ approved: false, approver: 'user' });
      }
    });
  });
}

/**
 * Bad Vibes Firewall class.
 *
 * Provides guard functions for destructive operations, implementing PRD §5.5
 * and SPEC-SECURITY §1 requirements. Records all approval decisions to
 * NDJSON logs and state JSON for audit trails.
 */
class BadVibesFirewall {
  /**
   * @param {FirewallOptions} [options]
   */
  constructor(options = {}) {
    this.autoApprove = Boolean(options.autoApprove);
    this.stateDir = options.stateDir || DEFAULT_STATE_DIR;
    this.logsDir = options.logsDir || DEFAULT_LOGS_DIR;
    this.promptHandler = options.promptHandler || defaultPromptHandler;
    this.logger = options.logger || null;
  }

  /**
   * Guards a destructive operation by prompting for approval.
   *
   * @param {ActionDescriptor} action - Description of the destructive operation
   * @returns {Promise<FirewallResult>}
   */
  async guard(action) {
    const normalizedAction = this._normalizeAction(action);
    const timestamp = new Date().toISOString();

    let approved = false;
    let approver = 'system';
    let reason = 'denied';

    if (this.autoApprove) {
      approved = true;
      approver = 'auto';
      reason = 'auto-approved';
    } else {
      const result = await this.promptHandler(normalizedAction);
      approved = result.approved;
      approver = result.approver;
      reason = approved ? 'user-approved' : 'user-denied';
    }

    const record = {
      operation: normalizedAction.operation,
      affectedPaths: normalizedAction.affectedPaths,
      approved,
      approver,
      timestamp,
      requirementId: normalizedAction.requirementId || REQUIREMENT_ID,
      riskLevel: normalizedAction.riskLevel,
      devCycleId: normalizedAction.devCycleId,
      phase: normalizedAction.phase,
      rollbackSteps: normalizedAction.rollbackSteps,
    };

    // Log the decision
    await this._logApproval(record);
    await this._persistState(record);

    // Call external logger if provided
    if (this.logger) {
      this.logger.log({
        phase: normalizedAction.phase || 'security',
        severity: approved ? 'info' : 'warn',
        requirementId: REQUIREMENT_ID,
        message: approved
          ? `Firewall approved: ${normalizedAction.operation}`
          : `Firewall denied: ${normalizedAction.operation}`,
        data: record,
      });
    }

    return { approved, approver, timestamp, reason };
  }

  /**
   * Guards and executes an action if approved.
   *
   * @template T
   * @param {ActionDescriptor} action - Description of the destructive operation
   * @param {() => Promise<T>} executor - Function to execute if approved
   * @returns {Promise<T>}
   * @throws {Error} If the operation is denied
   */
  async guardAndExecute(action, executor) {
    const result = await this.guard(action);

    if (!result.approved) {
      throw new Error(`${FIREWALL_LABEL}: Operation denied - ${action.operation}`);
    }

    return executor();
  }

  /**
   * Creates a pre-configured guard for a specific DevCycle.
   *
   * @param {string} devCycleId - DevCycle identifier
   * @param {string} [phase] - Phase within the DevCycle
   * @returns {(action: Partial<ActionDescriptor>) => Promise<FirewallResult>}
   */
  createDevCycleGuard(devCycleId, phase) {
    return async (action) => {
      return this.guard({
        devCycleId,
        phase,
        ...action,
      });
    };
  }

  /**
   * Normalizes an action descriptor with defaults.
   *
   * @param {Partial<ActionDescriptor>} action
   * @returns {ActionDescriptor}
   */
  _normalizeAction(action) {
    return {
      operation: action.operation || 'Unknown destructive operation',
      affectedPaths: action.affectedPaths || [],
      requiredApprovals: action.requiredApprovals || ['user confirmation'],
      rollbackSteps: action.rollbackSteps || [],
      riskLevel: action.riskLevel || 'medium',
      devCycleId: action.devCycleId,
      phase: action.phase,
      requirementId: action.requirementId,
    };
  }

  /**
   * Logs an approval record to NDJSON.
   *
   * @param {ApprovalRecord} record
   * @returns {Promise<void>}
   */
  async _logApproval(record) {
    try {
      if (!existsSync(this.logsDir)) {
        await mkdir(this.logsDir, { recursive: true });
      }

      const logPath = path.join(this.logsDir, LOG_FILE);
      const payload = {
        ...record,
        type: 'firewall-decision',
      };

      await writeFile(logPath, `${JSON.stringify(payload)}\n`, { flag: 'a', encoding: 'utf8' });
    } catch {
      // Best-effort logging; failures should not crash the CLI.
    }
  }

  /**
   * Persists approval record to state JSON.
   *
   * @param {ApprovalRecord} record
   * @returns {Promise<void>}
   */
  async _persistState(record) {
    try {
      if (!existsSync(this.stateDir)) {
        await mkdir(this.stateDir, { recursive: true });
      }

      const statePath = path.join(this.stateDir, STATE_FILE);
      let records = [];

      if (existsSync(statePath)) {
        try {
          const raw = await readFile(statePath, 'utf8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            records = parsed;
          }
        } catch {
          // Ignore parse issues; start fresh.
        }
      }

      records.push(record);

      // Trim to max records
      if (records.length > MAX_STATE_RECORDS) {
        records = records.slice(records.length - MAX_STATE_RECORDS);
      }

      await writeFile(statePath, JSON.stringify(records, null, 2), 'utf8');
    } catch {
      // Best-effort persistence; failures should not crash the CLI.
    }
  }

  /**
   * Gets historical approval records from state.
   *
   * @returns {Promise<ApprovalRecord[]>}
   */
  async getApprovalHistory() {
    try {
      const statePath = path.join(this.stateDir, STATE_FILE);
      if (!existsSync(statePath)) {
        return [];
      }

      const raw = await readFile(statePath, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Clears approval history (for testing/maintenance).
   *
   * @returns {Promise<void>}
   */
  async clearHistory() {
    try {
      const statePath = path.join(this.stateDir, STATE_FILE);
      if (existsSync(statePath)) {
        await writeFile(statePath, '[]', 'utf8');
      }
    } catch {
      // Ignore errors.
    }
  }
}

/**
 * Creates a new Bad Vibes Firewall instance.
 *
 * @param {FirewallOptions} [options]
 * @returns {BadVibesFirewall}
 */
function createBadVibesFirewall(options = {}) {
  return new BadVibesFirewall(options);
}

/**
 * Default firewall instance for convenience.
 */
const defaultFirewall = new BadVibesFirewall();

/**
 * Common destructive operation templates.
 * Pre-configured action descriptors for common CLI operations.
 */
const COMMON_OPERATIONS = {
  /**
   * Creates an action descriptor for file deletion.
   *
   * @param {string[]} paths - Files to delete
   * @returns {ActionDescriptor}
   */
  fileDelete: (paths) => ({
    operation: `Delete ${paths.length} file(s)`,
    affectedPaths: paths,
    requiredApprovals: ['user confirmation'],
    rollbackSteps: [
      'Check .loaded-vibes/backup/ for recent backups',
      'Use git checkout to restore from version control if available',
      'Manually recreate files from templates if needed',
    ],
    riskLevel: paths.length > 5 ? 'high' : 'medium',
  }),

  /**
   * Creates an action descriptor for directory deletion.
   *
   * @param {string} dirPath - Directory to delete
   * @returns {ActionDescriptor}
   */
  directoryDelete: (dirPath) => ({
    operation: `Delete directory: ${dirPath}`,
    affectedPaths: [dirPath],
    requiredApprovals: ['user confirmation'],
    rollbackSteps: [
      'Check .loaded-vibes/backup/ for recent backups',
      'Use git checkout to restore from version control if available',
      'Re-run initialization to recreate directory structure',
    ],
    riskLevel: 'high',
  }),

  /**
   * Creates an action descriptor for database migration.
   *
   * @param {string} migrationName - Name of the migration
   * @returns {ActionDescriptor}
   */
  databaseMigration: (migrationName) => ({
    operation: `Apply database migration: ${migrationName}`,
    affectedPaths: ['prisma/migrations/', 'database schema'],
    requiredApprovals: ['user confirmation', 'database backup verification'],
    rollbackSteps: [
      'Run prisma migrate reset to restore previous state',
      'Restore database from backup if available',
      'Contact database administrator for manual recovery',
    ],
    riskLevel: 'critical',
  }),

  /**
   * Creates an action descriptor for configuration overwrite.
   *
   * @param {string[]} configPaths - Configuration files to overwrite
   * @returns {ActionDescriptor}
   */
  configOverwrite: (configPaths) => ({
    operation: `Overwrite configuration files`,
    affectedPaths: configPaths,
    requiredApprovals: ['user confirmation'],
    rollbackSteps: [
      'Check .loaded-vibes/backup/ for previous configs',
      'Use git diff to review changes',
      'Use git checkout to restore original files',
    ],
    riskLevel: 'medium',
  }),

  /**
   * Creates an action descriptor for upgrade operations.
   *
   * @param {string} fromVersion - Current version
   * @param {string} toVersion - Target version
   * @returns {ActionDescriptor}
   */
  upgrade: (fromVersion, toVersion) => ({
    operation: `Upgrade from ${fromVersion} to ${toVersion}`,
    affectedPaths: ['.loaded-vibes/', 'configuration files'],
    requiredApprovals: ['user confirmation', 'backup verification'],
    rollbackSteps: [
      `Run 'loaded-vibes restore --from ${fromVersion}' to rollback`,
      'Check .loaded-vibes/backup/ for automatic backups',
      'Manually restore from git history if needed',
    ],
    riskLevel: 'high',
  }),

  /**
   * Creates an action descriptor for DevCycle state reset.
   *
   * @param {string} devCycleId - DevCycle to reset
   * @returns {ActionDescriptor}
   */
  devCycleReset: (devCycleId) => ({
    operation: `Reset DevCycle state: ${devCycleId}`,
    affectedPaths: ['.loaded-vibes/genaiscript/state/'],
    requiredApprovals: ['user confirmation'],
    rollbackSteps: [
      'State cannot be automatically recovered after reset',
      'Check NDJSON logs for historical execution data',
      'Re-run the DevCycle to regenerate state',
    ],
    riskLevel: 'medium',
  }),
};

export {
  BadVibesFirewall,
  createBadVibesFirewall,
  defaultFirewall,
  formatFirewallSummary,
  getRiskDisplay,
  COMMON_OPERATIONS,
  FIREWALL_LABEL,
  REQUIREMENT_ID,
  STATE_FILE,
  LOG_FILE,
  DEFAULT_STATE_DIR,
  DEFAULT_LOGS_DIR,
};
