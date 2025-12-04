// @ts-nocheck
/**
 * Unit tests for the upgrade command.
 *
 * @see docs/TECH_REQUIREMENTS.md §11 - Customization Versioning Strategy
 * @see docs/decisions/ADR-001-customization-versioning-strategy.md
 */

import { strict as assert } from 'node:assert';
import test, { describe, beforeEach, afterEach } from 'node:test';
import { mkdtemp, rm, writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';

// Import the upgrade module
import { runUpgrade } from '../upgrade.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));

/**
 * Helper to create a temp directory for tests.
 */
async function withTempDir(fn) {
  const tempDir = await mkdtemp(path.join(tmpdir(), 'upgrade-test-'));
  try {
    await fn(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

/**
 * Helper to compute checksum.
 */
function computeChecksum(content) {
  return createHash('sha256').update(content).digest('hex').toLowerCase();
}

/**
 * Helper to set up a mock shipped root.
 */
async function setupShippedRoot(tempDir, version = '1.0.0') {
  const shippedRoot = path.join(tempDir, 'shipped');
  await mkdir(shippedRoot, { recursive: true });
  await mkdir(path.join(shippedRoot, '.github'), { recursive: true });
  await mkdir(path.join(shippedRoot, 'genaiscript'), { recursive: true });

  // Write VERSION file
  await writeFile(path.join(shippedRoot, 'VERSION'), version, 'utf8');

  // Write some test files
  await writeFile(
    path.join(shippedRoot, '.github', 'test-prompt.md'),
    '# Test Prompt v' + version,
    'utf8'
  );
  await writeFile(
    path.join(shippedRoot, 'genaiscript', 'test-script.js'),
    '// Test script v' + version,
    'utf8'
  );

  return shippedRoot;
}

/**
 * Helper to set up a mock installed root.
 */
async function setupInstalledRoot(tempDir, version = '0.9.0', modified = false) {
  const installedRoot = path.join(tempDir, 'project', '.loaded-vibes');
  await mkdir(installedRoot, { recursive: true });
  await mkdir(path.join(installedRoot, '.github'), { recursive: true });
  await mkdir(path.join(installedRoot, 'genaiscript'), { recursive: true });
  await mkdir(path.join(installedRoot, 'logs'), { recursive: true });

  // Write VERSION file
  await writeFile(path.join(installedRoot, 'VERSION'), version, 'utf8');

  // Write test files (potentially modified)
  const content = modified ? '# Modified Prompt' : '# Test Prompt v' + version;
  await writeFile(path.join(installedRoot, '.github', 'test-prompt.md'), content, 'utf8');
  await writeFile(
    path.join(installedRoot, 'genaiscript', 'test-script.js'),
    '// Test script v' + version,
    'utf8'
  );

  return installedRoot;
}

// ============================================================
// Version Parsing Tests
// ============================================================

describe('Upgrade Command - Version Parsing', () => {
  test('runUpgrade returns analysis with version info', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.1.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      assert.ok(result.success, 'Upgrade should succeed in analyze mode');
      assert.ok(result.analysis, 'Should return analysis');
      assert.strictEqual(result.analysis.currentVersion, '1.0.0', 'Current version should be 1.0.0');
      assert.strictEqual(result.analysis.targetVersion, '1.1.0', 'Target version should be 1.1.0');
      assert.strictEqual(result.analysis.versionBump, 'minor', 'Version bump should be minor');
      assert.ok(result.analysis.upgradeAvailable, 'Upgrade should be available');
    });
  });

  test('runUpgrade detects no upgrade needed when versions match', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.0.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      assert.ok(result.success, 'Command should succeed');
      assert.strictEqual(result.analysis.versionBump, 'none', 'Version bump should be none');
      assert.ok(!result.analysis.upgradeAvailable, 'No upgrade should be available');
    });
  });

  test('runUpgrade detects downgrade attempt', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '0.8.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      assert.ok(result.success, 'Analyze should still succeed');
      assert.strictEqual(result.analysis.versionBump, 'downgrade', 'Should detect downgrade');
      assert.ok(!result.analysis.upgradeAvailable, 'No upgrade should be available');
    });
  });

  test('runUpgrade detects major version upgrade', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '2.0.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      assert.ok(result.success, 'Analyze should succeed');
      assert.strictEqual(result.analysis.versionBump, 'major', 'Should detect major bump');
      assert.ok(result.analysis.upgradeAvailable, 'Upgrade should be available');
    });
  });

  test('runUpgrade detects patch version upgrade', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.0.1');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      assert.ok(result.success, 'Analyze should succeed');
      assert.strictEqual(result.analysis.versionBump, 'patch', 'Should detect patch bump');
      assert.ok(result.analysis.upgradeAvailable, 'Upgrade should be available');
    });
  });
});

// ============================================================
// Asset Analysis Tests
// ============================================================

describe('Upgrade Command - Asset Analysis', () => {
  test('runUpgrade identifies modified assets', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.0.0');
      const installedRoot = await setupInstalledRoot(tempDir, '0.9.0', true);
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      assert.ok(result.success, 'Analyze should succeed');
      assert.ok(result.analysis.modifiedCount > 0, 'Should detect modified assets');
    });
  });

  test('runUpgrade identifies pristine assets', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.0.0');
      // Create installed root with same content as shipped
      const installedRoot = path.join(tempDir, 'project', '.loaded-vibes');
      await mkdir(installedRoot, { recursive: true });
      await mkdir(path.join(installedRoot, '.github'), { recursive: true });
      await mkdir(path.join(installedRoot, 'genaiscript'), { recursive: true });
      await mkdir(path.join(installedRoot, 'logs'), { recursive: true });

      await writeFile(path.join(installedRoot, 'VERSION'), '0.9.0', 'utf8');
      // Copy exact content from shipped
      await writeFile(
        path.join(installedRoot, '.github', 'test-prompt.md'),
        '# Test Prompt v1.0.0',
        'utf8'
      );
      await writeFile(
        path.join(installedRoot, 'genaiscript', 'test-script.js'),
        '// Test script v1.0.0',
        'utf8'
      );

      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      assert.ok(result.success, 'Analyze should succeed');
      assert.ok(result.analysis.pristineCount > 0, 'Should detect pristine assets');
    });
  });

  test('runUpgrade saves upgrade hints', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.0.0');
      const installedRoot = await setupInstalledRoot(tempDir, '0.9.0', true);
      const cwd = path.join(tempDir, 'project');

      await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      const hintsPath = path.join(installedRoot, 'upgrade-hints', 'v1.0.0.json');
      assert.ok(existsSync(hintsPath), 'Upgrade hints file should be created');

      const hintsContent = await readFile(hintsPath, 'utf8');
      const hints = JSON.parse(hintsContent);
      assert.strictEqual(hints.version, '1.0.0', 'Hints should reference target version');
    });
  });
});

// ============================================================
// Upgrade Strategy Tests
// ============================================================

describe('Upgrade Command - Mirror Strategy', () => {
  test('runUpgrade applies mirror strategy', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.1.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0', true);
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'mirror',
        autoApprove: true,
      });

      assert.ok(result.success, 'Upgrade should succeed');
      assert.ok(result.actions.length > 0, 'Should have actions');

      // Verify files were updated
      const versionContent = await readFile(path.join(installedRoot, 'VERSION'), 'utf8');
      assert.strictEqual(versionContent.trim(), '1.1.0', 'VERSION should be updated');
    });
  });

  test('runUpgrade creates backup before mirror', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.1.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'mirror',
        autoApprove: true,
      });

      const backupDir = path.join(installedRoot, 'backup');
      assert.ok(existsSync(backupDir), 'Backup directory should be created');
    });
  });
});

describe('Upgrade Command - Merge Strategy', () => {
  test('runUpgrade applies merge strategy', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.1.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'merge',
        autoApprove: true,
      });

      assert.ok(result.success, 'Upgrade should succeed');
      assert.ok(result.actions.length > 0, 'Should have actions');
    });
  });
});

describe('Upgrade Command - Sandbox Strategy', () => {
  test('runUpgrade applies sandbox strategy', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.1.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'sandbox',
        autoApprove: true,
      });

      assert.ok(result.success, 'Upgrade should succeed');
      assert.ok(result.actions.length > 0, 'Should have actions');

      // Verify sandbox was created
      const sandboxPath = path.join(installedRoot, 'sandbox', 'v1.1.0');
      assert.ok(existsSync(sandboxPath), 'Sandbox directory should be created');

      // Verify original VERSION was not changed (sandbox doesn't update installed)
      const versionContent = await readFile(path.join(installedRoot, 'VERSION'), 'utf8');
      assert.strictEqual(versionContent.trim(), '1.0.0', 'VERSION should not be updated in sandbox mode');
    });
  });
});

// ============================================================
// Tracking and Logging Tests
// ============================================================

describe('Upgrade Command - Asset Tracking', () => {
  test('runUpgrade updates assets.json after upgrade', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.1.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'merge',
        autoApprove: true,
      });

      const assetsPath = path.join(installedRoot, 'assets.json');
      assert.ok(existsSync(assetsPath), 'assets.json should be created');

      const assetsContent = await readFile(assetsPath, 'utf8');
      const assets = JSON.parse(assetsContent);
      assert.ok(assets.assets, 'Should have assets object');
    });
  });

  test('runUpgrade updates manifest.json with upgrade history', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.1.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'merge',
        autoApprove: true,
      });

      const manifestPath = path.join(installedRoot, 'manifest.json');
      assert.ok(existsSync(manifestPath), 'manifest.json should be created');

      const manifestContent = await readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestContent);
      assert.strictEqual(manifest.frameworkVersion, '1.1.0', 'Framework version should be updated');
      assert.ok(Array.isArray(manifest.upgradeHistory), 'Should have upgrade history');
      assert.ok(manifest.upgradeHistory.length > 0, 'Upgrade history should have entries');
    });
  });

  test('runUpgrade writes upgrade log', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.1.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'merge',
        autoApprove: true,
      });

      assert.ok(result.logPath, 'Should return log path');
      assert.ok(existsSync(result.logPath), 'Log file should exist');

      const logContent = await readFile(result.logPath, 'utf8');
      assert.ok(logContent.includes('upgrade_complete'), 'Log should contain upgrade_complete event');
    });
  });
});

// ============================================================
// Edge Cases Tests
// ============================================================

describe('Upgrade Command - Edge Cases', () => {
  test('runUpgrade handles missing installed root', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');
      await mkdir(cwd, { recursive: true });

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        analyze: true,
        autoApprove: true,
      });

      assert.ok(result.success, 'Analyze should succeed even with missing installed root');
      assert.strictEqual(result.analysis.currentVersion, '0.0.0', 'Should default to 0.0.0');
    });
  });

  test('runUpgrade blocks major upgrade without --force', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '2.0.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'merge',
        autoApprove: true,
        // Note: not passing force: true
      });

      assert.ok(!result.success, 'Upgrade should fail without --force for major version');
    });
  });

  test('runUpgrade allows major upgrade with --force', async () => {
    await withTempDir(async (tempDir) => {
      const shippedRoot = await setupShippedRoot(tempDir, '2.0.0');
      const installedRoot = await setupInstalledRoot(tempDir, '1.0.0');
      const cwd = path.join(tempDir, 'project');

      const result = await runUpgrade({
        cwd,
        shippedRoot,
        strategy: 'merge',
        autoApprove: true,
        force: true,
      });

      assert.ok(result.success, 'Upgrade should succeed with --force for major version');
    });
  });
});
