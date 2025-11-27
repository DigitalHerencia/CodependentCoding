// @ts-nocheck
import { strict as assert } from 'node:assert';
import test from 'node:test';
import { mkdtemp, rm, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

import {
  BadVibesFirewall,
  createBadVibesFirewall,
  formatFirewallSummary,
  getRiskDisplay,
  COMMON_OPERATIONS,
  FIREWALL_LABEL,
  STATE_FILE,
  LOG_FILE,
} from '../badVibesFirewall.js';

async function withTempDirs(fn) {
  const base = await mkdtemp(path.join(tmpdir(), 'loaded-vibes-firewall-'));
  try {
    const stateDir = path.join(base, 'state');
    const logsDir = path.join(base, 'logs');
    await mkdir(stateDir, { recursive: true });
    await mkdir(logsDir, { recursive: true });
    await fn({ stateDir, logsDir, base });
  } finally {
    await rm(base, { recursive: true, force: true });
  }
}

test('[badVibesFirewall] getRiskDisplay returns correct emoji and label', () => {
  assert.deepEqual(getRiskDisplay('critical'), { emoji: '🔴', label: 'CRITICAL' });
  assert.deepEqual(getRiskDisplay('high'), { emoji: '🟠', label: 'HIGH' });
  assert.deepEqual(getRiskDisplay('medium'), { emoji: '🟡', label: 'MEDIUM' });
  assert.deepEqual(getRiskDisplay('low'), { emoji: '🟢', label: 'LOW' });
  assert.deepEqual(getRiskDisplay('unknown'), { emoji: '🟢', label: 'LOW' }); // default
});

test('[badVibesFirewall] formatFirewallSummary includes all required sections', () => {
  const action = {
    operation: 'Test Operation',
    affectedPaths: ['/path/to/file1', '/path/to/file2'],
    requiredApprovals: ['user confirmation', 'admin approval'],
    rollbackSteps: ['Step 1: Undo', 'Step 2: Restore'],
    riskLevel: 'high',
    devCycleId: 'security',
    phase: 'implement',
    requirementId: 'PRD §5.5',
  };

  const summary = formatFirewallSummary(action);

  assert.match(summary, /BAD VIBES FIREWALL/);
  assert.match(summary, /Risk Level: 🟠 HIGH/);
  assert.match(summary, /Operation: Test Operation/);
  assert.match(summary, /DevCycle: security/);
  assert.match(summary, /Phase: implement/);
  assert.match(summary, /AFFECTED PATHS:/);
  assert.match(summary, /\/path\/to\/file1/);
  assert.match(summary, /\/path\/to\/file2/);
  assert.match(summary, /REQUIRED APPROVALS:/);
  assert.match(summary, /user confirmation/);
  assert.match(summary, /admin approval/);
  assert.match(summary, /ROLLBACK STEPS/);
  assert.match(summary, /Step 1: Undo/);
  assert.match(summary, /Step 2: Restore/);
  assert.match(summary, /Requirement: PRD §5.5/);
});

test('[badVibesFirewall] auto-approve mode approves without prompting', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    let promptCalled = false;
    const firewall = createBadVibesFirewall({
      autoApprove: true,
      stateDir,
      logsDir,
      promptHandler: async () => {
        promptCalled = true;
        return { approved: false, approver: 'test' };
      },
    });

    const result = await firewall.guard({
      operation: 'Auto-approved test',
      affectedPaths: ['/test/path'],
      riskLevel: 'low',
    });

    assert.equal(result.approved, true);
    assert.equal(result.approver, 'auto');
    assert.equal(result.reason, 'auto-approved');
    assert.equal(promptCalled, false); // Prompt should not be called
  });
});

test('[badVibesFirewall] guard logs approval to NDJSON', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      autoApprove: true,
      stateDir,
      logsDir,
    });

    await firewall.guard({
      operation: 'Logged operation',
      affectedPaths: ['/logged/path'],
      riskLevel: 'medium',
      devCycleId: 'test-cycle',
      phase: 'validate',
    });

    const logPath = path.join(logsDir, LOG_FILE);
    assert.ok(existsSync(logPath), 'Log file should exist');

    const logContent = await readFile(logPath, 'utf8');
    const logEntry = JSON.parse(logContent.trim());

    assert.equal(logEntry.operation, 'Logged operation');
    assert.equal(logEntry.approved, true);
    assert.equal(logEntry.approver, 'auto');
    assert.equal(logEntry.devCycleId, 'test-cycle');
    assert.equal(logEntry.phase, 'validate');
    assert.equal(logEntry.type, 'firewall-decision');
  });
});

test('[badVibesFirewall] guard persists to state JSON', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      autoApprove: true,
      stateDir,
      logsDir,
    });

    await firewall.guard({
      operation: 'State test',
      affectedPaths: ['/state/path'],
      riskLevel: 'high',
    });

    const statePath = path.join(stateDir, STATE_FILE);
    assert.ok(existsSync(statePath), 'State file should exist');

    const stateContent = await readFile(statePath, 'utf8');
    const records = JSON.parse(stateContent);

    assert.equal(Array.isArray(records), true);
    assert.equal(records.length, 1);
    assert.equal(records[0].operation, 'State test');
    assert.equal(records[0].approved, true);
    assert.equal(records[0].riskLevel, 'high');
  });
});

test('[badVibesFirewall] denied operations are recorded', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      stateDir,
      logsDir,
      promptHandler: async () => ({ approved: false, approver: 'test-user' }),
    });

    const result = await firewall.guard({
      operation: 'Denied operation',
      affectedPaths: ['/denied/path'],
      riskLevel: 'critical',
    });

    assert.equal(result.approved, false);
    assert.equal(result.reason, 'user-denied');

    const statePath = path.join(stateDir, STATE_FILE);
    const stateContent = await readFile(statePath, 'utf8');
    const records = JSON.parse(stateContent);

    assert.equal(records[0].approved, false);
    assert.equal(records[0].approver, 'test-user');
  });
});

test('[badVibesFirewall] guardAndExecute throws on denial', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      stateDir,
      logsDir,
      promptHandler: async () => ({ approved: false, approver: 'user' }),
    });

    let executed = false;
    await assert.rejects(
      () =>
        firewall.guardAndExecute(
          { operation: 'Blocked operation', riskLevel: 'high' },
          async () => {
            executed = true;
          }
        ),
      /Operation denied/
    );

    assert.equal(executed, false, 'Executor should not run on denial');
  });
});

test('[badVibesFirewall] guardAndExecute runs executor on approval', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      stateDir,
      logsDir,
      promptHandler: async () => ({ approved: true, approver: 'test-user' }),
    });

    let executed = false;
    await firewall.guardAndExecute({ operation: 'Allowed operation', riskLevel: 'low' }, async () => {
      executed = true;
    });

    assert.equal(executed, true, 'Executor should run on approval');
  });
});

test('[badVibesFirewall] createDevCycleGuard pre-configures DevCycle context', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      autoApprove: true,
      stateDir,
      logsDir,
    });

    const guard = firewall.createDevCycleGuard('initialization', 'analyze');
    await guard({ operation: 'Cycle-specific operation' });

    const statePath = path.join(stateDir, STATE_FILE);
    const stateContent = await readFile(statePath, 'utf8');
    const records = JSON.parse(stateContent);

    assert.equal(records[0].devCycleId, 'initialization');
    assert.equal(records[0].phase, 'analyze');
  });
});

test('[badVibesFirewall] getApprovalHistory returns all records', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      autoApprove: true,
      stateDir,
      logsDir,
    });

    await firewall.guard({ operation: 'Op 1', riskLevel: 'low' });
    await firewall.guard({ operation: 'Op 2', riskLevel: 'medium' });
    await firewall.guard({ operation: 'Op 3', riskLevel: 'high' });

    const history = await firewall.getApprovalHistory();
    assert.equal(history.length, 3);
    assert.equal(history[0].operation, 'Op 1');
    assert.equal(history[1].operation, 'Op 2');
    assert.equal(history[2].operation, 'Op 3');
  });
});

test('[badVibesFirewall] clearHistory removes all records', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      autoApprove: true,
      stateDir,
      logsDir,
    });

    await firewall.guard({ operation: 'Op 1', riskLevel: 'low' });
    await firewall.guard({ operation: 'Op 2', riskLevel: 'medium' });

    await firewall.clearHistory();
    const history = await firewall.getApprovalHistory();
    assert.equal(history.length, 0);
  });
});

test('[badVibesFirewall] COMMON_OPERATIONS.fileDelete generates correct descriptor', () => {
  const paths = ['/file1.txt', '/file2.txt', '/file3.txt'];
  const action = COMMON_OPERATIONS.fileDelete(paths);

  assert.match(action.operation, /Delete 3 file/);
  assert.deepEqual(action.affectedPaths, paths);
  assert.equal(action.riskLevel, 'medium');
  assert.ok(action.rollbackSteps.length > 0);
});

test('[badVibesFirewall] COMMON_OPERATIONS.fileDelete escalates risk for many files', () => {
  const paths = Array.from({ length: 10 }, (_, i) => `/file${i}.txt`);
  const action = COMMON_OPERATIONS.fileDelete(paths);

  assert.equal(action.riskLevel, 'high'); // >5 files escalates to high
});

test('[badVibesFirewall] COMMON_OPERATIONS.databaseMigration is critical risk', () => {
  const action = COMMON_OPERATIONS.databaseMigration('add-users-table');

  assert.equal(action.riskLevel, 'critical');
  assert.match(action.operation, /add-users-table/);
  assert.ok(action.requiredApprovals.includes('database backup verification'));
});

test('[badVibesFirewall] COMMON_OPERATIONS.upgrade includes version info', () => {
  const action = COMMON_OPERATIONS.upgrade('1.0.0', '2.0.0');

  assert.match(action.operation, /1\.0\.0/);
  assert.match(action.operation, /2\.0\.0/);
  assert.equal(action.riskLevel, 'high');
  assert.ok(action.rollbackSteps.some((step) => step.includes('1.0.0')));
});

test('[badVibesFirewall] external logger receives events', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const loggedEvents = [];
    const mockLogger = {
      log: (event) => loggedEvents.push(event),
    };

    const firewall = createBadVibesFirewall({
      autoApprove: true,
      stateDir,
      logsDir,
      logger: mockLogger,
    });

    await firewall.guard({
      operation: 'Logger test',
      riskLevel: 'medium',
      phase: 'test-phase',
    });

    assert.equal(loggedEvents.length, 1);
    assert.equal(loggedEvents[0].phase, 'test-phase');
    assert.equal(loggedEvents[0].severity, 'info');
    assert.match(loggedEvents[0].message, /Firewall approved/);
    assert.ok(loggedEvents[0].data.operation === 'Logger test');
  });
});

test('[badVibesFirewall] denied operations log as warnings', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const loggedEvents = [];
    const mockLogger = {
      log: (event) => loggedEvents.push(event),
    };

    const firewall = createBadVibesFirewall({
      stateDir,
      logsDir,
      logger: mockLogger,
      promptHandler: async () => ({ approved: false, approver: 'user' }),
    });

    await firewall.guard({
      operation: 'Denied logger test',
      riskLevel: 'high',
    });

    assert.equal(loggedEvents.length, 1);
    assert.equal(loggedEvents[0].severity, 'warn');
    assert.match(loggedEvents[0].message, /Firewall denied/);
  });
});

test('[badVibesFirewall] normalizes action with defaults', async () => {
  await withTempDirs(async ({ stateDir, logsDir }) => {
    const firewall = createBadVibesFirewall({
      autoApprove: true,
      stateDir,
      logsDir,
    });

    // Minimal action
    await firewall.guard({});

    const statePath = path.join(stateDir, STATE_FILE);
    const stateContent = await readFile(statePath, 'utf8');
    const records = JSON.parse(stateContent);

    assert.equal(records[0].operation, 'Unknown destructive operation');
    assert.deepEqual(records[0].affectedPaths, []);
    assert.equal(records[0].riskLevel, 'medium');
  });
});
