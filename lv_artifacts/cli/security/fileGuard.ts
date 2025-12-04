// @ts-nocheck
/**
 * File Guard helper enforcing `.loaded-vibes/**` write boundaries.
 * Implements PRD §5.5, TECH_REQUIREMENTS §5.4, and SPEC-SECURITY §1
 * by routing CLI file writes through Bad Vibes Firewall approvals.
 */

import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir, writeFile, readFile, rm, cp, copyFile } from 'fs/promises';
import { mkdirSync, writeFileSync, existsSync } from 'fs';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ALLOWED_ROOT = path.resolve(CURRENT_DIR, '..', '..', '..');
const REQUIREMENT_ID = 'PRD §5.5 / SPEC-SECURITY §1';
const FIREWALL_LABEL = 'Bad Vibes Firewall (#23)';
const STATE_FILE = 'security-approvals.json';
const MAX_STATE_RECORDS = 100;

function normalizePath(targetPath) {
  const resolved = path.resolve(targetPath);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function defaultPrompt(payload) {
  const summary = payload.summary || 'External write detected.';
  if (!process.stdin.isTTY) {
    console.warn(`${FIREWALL_LABEL}: non-interactive shell detected; rejecting by default.`);
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    console.log('\n============================================================');
    console.log(`${FIREWALL_LABEL} approval required`);
    console.log('============================================================');
    console.log(summary);
    console.log(`\nRequirement: ${REQUIREMENT_ID}`);
    rl.question('\nProceed with this write? (y/N): ', (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase().startsWith('y'));
    });
  });
}

function buildTemplateSummary(templates = []) {
  if (!templates.length) {
    return '';
  }

  const lines = [];
  lines.push('Templates to copy:');
  templates.forEach((template) => {
    const label = template.label || path.basename(template.source);
    lines.push(`  • ${label} → ${template.destination}`);
  });
  return lines.join('\n');
}

class FileGuard {
  constructor(options = {}) {
    this.allowedRoot = path.resolve(options.allowedRoot || DEFAULT_ALLOWED_ROOT);
    this.allowedRootNormalized = normalizePath(this.allowedRoot);
    this.autoApprove = Boolean(options.autoApprove);
    this.promptHandler = options.prompt || defaultPrompt;
    this.logger = options.logger || null;
    this.whitelistedPrefixes = new Set();
  }

  isWithinBoundary(targetPath) {
    const normalized = normalizePath(targetPath);
    if (
      normalized === this.allowedRootNormalized ||
      normalized.startsWith(this.allowedRootNormalized + path.sep)
    ) {
      return true;
    }

    for (const prefix of this.whitelistedPrefixes) {
      if (normalized === prefix || normalized.startsWith(prefix + path.sep)) {
        return true;
      }
    }
    return false;
  }

  async ensureWithinBoundary(targetPath, metadata = {}) {
    if (this.isWithinBoundary(targetPath)) {
      return { approved: true, reason: 'within-boundary' };
    }

    const summary = this._buildSummary(targetPath, metadata);
    const approved = this.autoApprove
      ? true
      : await this.promptHandler({
          targetPath,
          summary,
          metadata,
        });

    await this._logDecision({ targetPath, approved, summary, metadata });

    if (!approved) {
      throw new Error(`${FIREWALL_LABEL}: write blocked for ${targetPath}`);
    }

    const normalized = normalizePath(targetPath);
    this.whitelistedPrefixes.add(normalized);
    return { approved: true, reason: 'firewall-approved' };
  }

  ensureWithinBoundarySync(targetPath) {
    if (this.isWithinBoundary(targetPath)) {
      return true;
    }
    throw new Error(`${FIREWALL_LABEL}: synchronous write blocked for ${targetPath}`);
  }

  async runGuarded(targetPath, metadata, action) {
    await this.ensureWithinBoundary(targetPath, metadata);
    return action();
  }

  async writeFile(targetPath, data, options) {
    return this.runGuarded(targetPath, { operation: 'writeFile' }, () =>
      writeFile(targetPath, data, options)
    );
  }

  writeFileSync(targetPath, data, options) {
    this.ensureWithinBoundarySync(targetPath);
    return writeFileSync(targetPath, data, options);
  }

  async mkdir(targetPath, options) {
    return this.runGuarded(targetPath, { operation: 'mkdir' }, () => mkdir(targetPath, options));
  }

  mkdirSync(targetPath, options) {
    this.ensureWithinBoundarySync(targetPath);
    return mkdirSync(targetPath, options);
  }

  async copyIntoRoot(sourcePath, destinationPath, options) {
    return this.runGuarded(destinationPath, { operation: 'copy', source: sourcePath }, () =>
      cp(sourcePath, destinationPath, options)
    );
  }

  async copyFileIntoRoot(sourcePath, destinationPath) {
    return this.runGuarded(destinationPath, { operation: 'copyFile', source: sourcePath }, () =>
      copyFile(sourcePath, destinationPath)
    );
  }

  async remove(targetPath, options = { recursive: true, force: true }) {
    return this.runGuarded(targetPath, { operation: 'remove' }, () => rm(targetPath, options));
  }

  async approveTemplateCopy(destinationRoot, templates = []) {
    const summary = [
      `${FIREWALL_LABEL}: Template copy requested outside ${this.allowedRoot}`,
      buildTemplateSummary(templates),
    ]
      .filter(Boolean)
      .join('\n');

    await this.ensureWithinBoundary(destinationRoot, {
      operation: 'template-copy',
      summary,
      templates,
    });
  }

  _buildSummary(targetPath, metadata = {}) {
    const details = [];
    details.push(`${FIREWALL_LABEL}: write requested outside ${this.allowedRoot}`);
    details.push(`Target: ${path.resolve(targetPath)}`);
    if (metadata.operation) {
      details.push(`Operation: ${metadata.operation}`);
    }
    if (metadata.summary) {
      details.push(metadata.summary);
    }
    if (metadata.templates && metadata.templates.length > 0) {
      details.push(buildTemplateSummary(metadata.templates));
    }
    details.push(`Requirement: ${REQUIREMENT_ID}`);
    return details.join('\n');
  }

  async _logDecision(entry) {
    const message = entry.approved
      ? `Approved external write to ${entry.targetPath}`
      : `Blocked external write to ${entry.targetPath}`;

    if (this.logger) {
      this.logger.log({
        phase: 'security',
        severity: entry.approved ? 'info' : 'warn',
        requirementId: REQUIREMENT_ID,
        message,
        data: {
          targetPath: entry.targetPath,
          operation: entry.metadata?.operation || 'unknown',
        },
      });
    }

    await this._appendSecurityLog(entry);
    await this._appendState(entry);
  }

  async _appendSecurityLog(entry) {
    try {
      const logsDir = path.join(this.allowedRoot, 'logs');
      await mkdir(logsDir, { recursive: true });
      const logPath = path.join(logsDir, 'security.ndjson');
      const payload = {
        targetPath: path.resolve(entry.targetPath),
        approved: entry.approved,
        timestamp: new Date().toISOString(),
        requirementId: REQUIREMENT_ID,
        operation: entry.metadata?.operation || 'unknown',
        summary: entry.summary,
      };
      await writeFile(logPath, `${JSON.stringify(payload)}\n`, { flag: 'a', encoding: 'utf8' });
    } catch {
      // Best-effort logging.
    }
  }

  async _appendState(entry) {
    try {
      const stateDir = path.join(this.allowedRoot, 'genaiscript', 'state');
      await mkdir(stateDir, { recursive: true });
      const statePath = path.join(stateDir, STATE_FILE);

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

      records.push({
        targetPath: path.resolve(entry.targetPath),
        approved: entry.approved,
        timestamp: new Date().toISOString(),
        requirementId: REQUIREMENT_ID,
        operation: entry.metadata?.operation || 'unknown',
      });

      if (records.length > MAX_STATE_RECORDS) {
        records = records.slice(records.length - MAX_STATE_RECORDS);
      }

      await writeFile(statePath, JSON.stringify(records, null, 2), 'utf8');
    } catch {
      // Best-effort logging; failures should not crash the CLI.
    }
  }
}

function createFileGuard(options = {}) {
  return new FileGuard(options);
}

const defaultFileGuard = new FileGuard();

export {
  FileGuard,
  createFileGuard,
  defaultFileGuard,
  DEFAULT_ALLOWED_ROOT,
  FIREWALL_LABEL,
  REQUIREMENT_ID,
};
