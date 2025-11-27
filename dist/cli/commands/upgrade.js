// @ts-nocheck
/**
 * Loaded Vibes Upgrade Command
 *
 * Implements `loaded-vibes upgrade` with semantic versioning, diff hints,
 * customization preservation, and SHA verification per ADR-001 and Issue #11.
 *
 * @module dist/cli/commands/upgrade
 * @see docs/PRD.md §5.1 - Distribution & Installation
 * @see docs/TECH_REQUIREMENTS.md §11 - Customization Versioning Strategy
 * @see docs/decisions/ADR-001-customization-versioning-strategy.md
 * @see spec/cli.spec.md §3 - Distribution & Bootstrap Coupling
 * @see spec/security.spec.md §1-2 - Policies, Component Controls
 *
 * Closes #11.
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { readFile, writeFile, mkdir, rm, cp, copyFile, readdir, stat } from 'fs/promises';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

import { createLogger } from '../services/ndjsonLogger.js';
import { createFileGuard } from '../security/fileGuard.js';
import { createBadVibesFirewall, COMMON_OPERATIONS } from '../security/badVibesFirewall.js';
import { verifySHA256, computeSHA256 } from '../security/shaVerifier.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PHASE = 'upgrade';
const REQUIREMENT_ID = 'TECH §11';
const PRD_REF = 'PRD §5.1';
const SPEC_REF = 'SPEC-CLI §3';
const ADR_REF = 'ADR-001';

// Default paths
const DEFAULT_SHIPPED_ROOT = path.resolve(CURRENT_DIR, '..', '..');
const DEFAULT_INSTALLED_ROOT_SEGMENT = '.loaded-vibes';

// Version file locations
const VERSION_FILE = 'VERSION';
const MANIFEST_FILE = 'manifest.json';
const ASSETS_FILE = 'assets.json';
const UPGRADE_HINTS_DIR = 'upgrade-hints';
const BACKUP_DIR = 'backup';
const LOGS_DIR = 'logs';
const MAX_BACKUPS = 5;

/**
 * Semantic version comparison result
 * @typedef {'major'|'minor'|'patch'|'none'|'downgrade'} VersionBump
 */

/**
 * Asset status
 * @typedef {'pristine'|'modified'|'conflict'} AssetStatus
 */

/**
 * Upgrade strategy
 * @typedef {'mirror'|'merge'|'sandbox'} UpgradeStrategy
 */

/**
 * Upgrade options
 * @typedef {Object} UpgradeOptions
 * @property {string} [cwd] - Working directory
 * @property {UpgradeStrategy} [strategy] - Upgrade strategy (default: merge)
 * @property {boolean} [analyze] - Only analyze, don't apply changes
 * @property {boolean} [autoApprove] - Auto-approve all prompts
 * @property {boolean} [verbose] - Verbose output
 * @property {string} [shippedRoot] - Override shipped assets root
 * @property {boolean} [force] - Force upgrade even on major version changes
 */

/**
 * Asset tracking entry
 * @typedef {Object} AssetEntry
 * @property {string} frameworkChecksum - SHA256 of shipped version
 * @property {string} localChecksum - Current file checksum
 * @property {string} frameworkVersion - Version when last synced
 * @property {string} lastModified - Local modification timestamp
 * @property {AssetStatus} status - Asset status
 */

/**
 * Upgrade analysis result
 * @typedef {Object} UpgradeAnalysis
 * @property {string} currentVersion - Current installed version
 * @property {string} targetVersion - Target version to upgrade to
 * @property {VersionBump} versionBump - Type of version bump
 * @property {boolean} upgradeAvailable - Whether upgrade is available
 * @property {number} pristineCount - Count of unchanged assets
 * @property {number} modifiedCount - Count of locally modified assets
 * @property {number} conflictCount - Count of conflicting assets
 * @property {string[]} modifiedAssets - List of modified asset paths
 * @property {string[]} conflictAssets - List of conflicting asset paths
 * @property {Object} diffHints - Diff hints for each changed asset
 */

/**
 * Parses a semantic version string.
 * @param {string} version - Version string (e.g., "1.2.3")
 * @returns {{major: number, minor: number, patch: number, valid: boolean}}
 */
function parseVersion(version) {
  if (!version || typeof version !== 'string') {
    return { major: 0, minor: 0, patch: 0, valid: false };
  }

  const cleaned = version.replace(/^v/i, '').trim();
  const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)/);

  if (!match) {
    return { major: 0, minor: 0, patch: 0, valid: false };
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    valid: true,
  };
}

/**
 * Compares two semantic versions and determines the bump type.
 * @param {string} current - Current version
 * @param {string} target - Target version
 * @returns {VersionBump}
 */
function compareVersions(current, target) {
  const currentParsed = parseVersion(current);
  const targetParsed = parseVersion(target);

  if (!currentParsed.valid || !targetParsed.valid) {
    return 'none';
  }

  if (targetParsed.major > currentParsed.major) {
    return 'major';
  }
  if (targetParsed.major < currentParsed.major) {
    return 'downgrade';
  }

  if (targetParsed.minor > currentParsed.minor) {
    return 'minor';
  }
  if (targetParsed.minor < currentParsed.minor) {
    return 'downgrade';
  }

  if (targetParsed.patch > currentParsed.patch) {
    return 'patch';
  }
  if (targetParsed.patch < currentParsed.patch) {
    return 'downgrade';
  }

  return 'none';
}

/**
 * Reads a version from a VERSION file.
 * @param {string} versionPath - Path to VERSION file
 * @returns {Promise<string>}
 */
async function readVersionFile(versionPath) {
  if (!existsSync(versionPath)) {
    return '0.0.0';
  }

  try {
    const content = await readFile(versionPath, 'utf8');
    return content.trim();
  } catch {
    return '0.0.0';
  }
}

/**
 * Reads the manifest.json file.
 * @param {string} manifestPath - Path to manifest.json
 * @returns {Promise<Object|null>}
 */
async function readManifest(manifestPath) {
  if (!existsSync(manifestPath)) {
    return null;
  }

  try {
    const content = await readFile(manifestPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Reads the assets.json tracking file.
 * @param {string} assetsPath - Path to assets.json
 * @returns {Promise<Object>}
 */
async function readAssets(assetsPath) {
  if (!existsSync(assetsPath)) {
    return { assets: {} };
  }

  try {
    const content = await readFile(assetsPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return { assets: {} };
  }
}

/**
 * Computes SHA256 checksum of a file synchronously.
 * @param {string} filePath - Path to file
 * @returns {string}
 */
function computeChecksumSync(filePath) {
  if (!existsSync(filePath)) {
    return '';
  }

  try {
    const buffer = readFileSync(filePath);
    const hash = createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
  } catch {
    return '';
  }
}

/**
 * Recursively lists all files in a directory.
 * @param {string} dir - Directory path
 * @param {string} [prefix] - Path prefix
 * @returns {Promise<string[]>}
 */
async function listFilesRecursive(dir, prefix = '') {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relPath = path.join(prefix, entry.name);
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const childFiles = await listFilesRecursive(fullPath, relPath);
      files.push(...childFiles);
    } else if (entry.isFile()) {
      files.push(relPath);
    }
  }

  return files;
}

/**
 * Prompts the user for a yes/no answer.
 * @param {string} question - Question to ask
 * @param {boolean} [autoApprove] - Auto-approve
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
 * Prompts user to select an upgrade strategy.
 * @param {boolean} [autoApprove] - Auto-approve (defaults to merge)
 * @returns {Promise<UpgradeStrategy>}
 */
async function promptStrategy(autoApprove = false) {
  if (autoApprove || !process.stdin.isTTY) {
    return 'merge';
  }

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('');
    console.log('Select upgrade strategy:');
    console.log('  [m] Merge   - Preserve customizations, auto-merge non-conflicting changes');
    console.log('  [i] Mirror  - Replace all assets with upstream (backs up local modifications)');
    console.log('  [s] Sandbox - Extract to sandbox for evaluation before applying');
    console.log('');

    rl.question('Strategy (m/i/s): ', (answer) => {
      rl.close();
      const choice = answer.trim().toLowerCase();
      if (choice === 'i' || choice === 'mirror') {
        resolve('mirror');
      } else if (choice === 's' || choice === 'sandbox') {
        resolve('sandbox');
      } else {
        resolve('merge');
      }
    });
  });
}

/**
 * Analyzes upgrade between shipped and installed assets.
 * @param {string} shippedRoot - Shipped assets root
 * @param {string} installedRoot - Installed assets root
 * @param {Object} logger - NDJSON logger
 * @returns {Promise<UpgradeAnalysis>}
 */
async function analyzeUpgrade(shippedRoot, installedRoot, logger) {
  logger.info(PHASE, 'Starting upgrade analysis', { shippedRoot, installedRoot });

  // Read versions
  const currentVersion = await readVersionFile(path.join(installedRoot, VERSION_FILE));
  const targetVersion = await readVersionFile(path.join(shippedRoot, VERSION_FILE));
  const versionBump = compareVersions(currentVersion, targetVersion);

  logger.requirement(PHASE, REQUIREMENT_ID, `Version check: ${currentVersion} → ${targetVersion}`);

  // Read asset tracking
  const assetsData = await readAssets(path.join(installedRoot, ASSETS_FILE));
  const trackedAssets = assetsData.assets || {};

  // Get all shipped files
  const shippedFiles = await listFilesRecursive(shippedRoot);
  const relevantFiles = shippedFiles.filter(
    (f) =>
      !f.startsWith('node_modules') &&
      !f.startsWith('logs') &&
      !f.startsWith('backup') &&
      !f.startsWith('sandbox') &&
      f !== VERSION_FILE &&
      f !== MANIFEST_FILE &&
      f !== ASSETS_FILE
  );

  const pristineAssets = [];
  const modifiedAssets = [];
  const conflictAssets = [];
  const diffHints = {};

  for (const relPath of relevantFiles) {
    const shippedPath = path.join(shippedRoot, relPath);
    const installedPath = path.join(installedRoot, relPath);
    const shippedChecksum = computeChecksumSync(shippedPath);

    if (!existsSync(installedPath)) {
      // New file, will be added
      pristineAssets.push(relPath);
      continue;
    }

    const installedChecksum = computeChecksumSync(installedPath);
    const tracked = trackedAssets[relPath];

    if (installedChecksum === shippedChecksum) {
      // File is identical
      pristineAssets.push(relPath);
      continue;
    }

    // File differs - check if it was modified locally
    if (tracked && tracked.frameworkChecksum) {
      if (installedChecksum === tracked.frameworkChecksum) {
        // File matches last synced version, upstream has changed
        modifiedAssets.push(relPath);
        diffHints[relPath] = {
          action: 'update',
          reason: 'Upstream has changes, local is pristine from last sync',
          suggestedStrategy: 'merge',
        };
      } else if (shippedChecksum === tracked.frameworkChecksum) {
        // File was modified locally, upstream unchanged
        modifiedAssets.push(relPath);
        diffHints[relPath] = {
          action: 'keep',
          reason: 'Local modifications, upstream unchanged',
          suggestedStrategy: 'merge',
        };
      } else {
        // Both modified - conflict
        conflictAssets.push(relPath);
        diffHints[relPath] = {
          action: 'review',
          reason: 'Both local and upstream have changes',
          suggestedStrategy: 'merge',
        };
      }
    } else {
      // No tracking - assume modified locally
      modifiedAssets.push(relPath);
      diffHints[relPath] = {
        action: 'review',
        reason: 'File differs from shipped version (no tracking data)',
        suggestedStrategy: 'merge',
      };
    }
  }

  const analysis = {
    currentVersion,
    targetVersion,
    versionBump,
    upgradeAvailable: versionBump !== 'none' && versionBump !== 'downgrade',
    pristineCount: pristineAssets.length,
    modifiedCount: modifiedAssets.length,
    conflictCount: conflictAssets.length,
    pristineAssets,
    modifiedAssets,
    conflictAssets,
    diffHints,
  };

  logger.info(PHASE, 'Analysis complete', {
    currentVersion,
    targetVersion,
    versionBump,
    pristine: pristineAssets.length,
    modified: modifiedAssets.length,
    conflicts: conflictAssets.length,
  });

  return analysis;
}

/**
 * Formats upgrade analysis for console output.
 * @param {UpgradeAnalysis} analysis - Analysis result
 * @returns {string}
 */
function formatAnalysis(analysis) {
  const lines = [];

  lines.push('');
  lines.push('═'.repeat(60));
  lines.push(`📊 Upgrade Analysis: v${analysis.currentVersion} → v${analysis.targetVersion}`);
  lines.push('═'.repeat(60));
  lines.push('');

  // Version bump indicator
  const bumpEmoji =
    {
      major: '🔴 MAJOR',
      minor: '🟡 MINOR',
      patch: '🟢 PATCH',
      none: '⚪ UP TO DATE',
      downgrade: '⬇️ DOWNGRADE',
    }[analysis.versionBump] || '❓ UNKNOWN';

  lines.push(`Version Bump: ${bumpEmoji}`);
  lines.push('');

  if (analysis.versionBump === 'major') {
    lines.push('⚠️  MAJOR VERSION CHANGE');
    lines.push('   Breaking changes may be present. Manual review required.');
    lines.push('   Use --force to proceed with auto-upgrade.');
    lines.push('');
  }

  if (analysis.versionBump === 'none') {
    lines.push('✅ You are running the latest version.');
    return lines.join('\n');
  }

  if (analysis.versionBump === 'downgrade') {
    lines.push('⚠️  Target version is older than installed version.');
    lines.push('   Downgrades are not supported via upgrade command.');
    return lines.join('\n');
  }

  lines.push('📁 Asset Changes:');
  lines.push(`   ✅ ${analysis.pristineCount} assets unchanged (will auto-update)`);

  if (analysis.modifiedCount > 0) {
    lines.push(`   ⚠️  ${analysis.modifiedCount} assets modified locally:`);
    analysis.modifiedAssets.slice(0, 5).forEach((asset) => {
      lines.push(`      - ${asset}`);
    });
    if (analysis.modifiedAssets.length > 5) {
      lines.push(`      ... and ${analysis.modifiedAssets.length - 5} more`);
    }
  }

  if (analysis.conflictCount > 0) {
    lines.push(`   ❌ ${analysis.conflictCount} conflict(s) detected:`);
    analysis.conflictAssets.slice(0, 5).forEach((asset) => {
      lines.push(`      - ${asset}`);
    });
    if (analysis.conflictAssets.length > 5) {
      lines.push(`      ... and ${analysis.conflictAssets.length - 5} more`);
    }
  }

  lines.push('');
  lines.push('─'.repeat(60));
  lines.push(`Requirement: ${REQUIREMENT_ID}, ${PRD_REF}, ${SPEC_REF}`);
  lines.push(`Decision: ${ADR_REF}`);
  lines.push('─'.repeat(60));

  return lines.join('\n');
}

/**
 * Creates a backup of current assets.
 * @param {string} installedRoot - Installed assets root
 * @param {string} version - Current version being backed up
 * @param {Object} fileGuard - File guard instance
 * @param {Object} logger - Logger instance
 * @returns {Promise<string>} - Backup path
 */
async function createBackup(installedRoot, version, fileGuard, logger) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(installedRoot, BACKUP_DIR);
  const backupPath = path.join(backupDir, `v${version}-${timestamp}`);

  logger.info(PHASE, `Creating backup at ${backupPath}`);

  await fileGuard.mkdir(backupDir, { recursive: true });
  await fileGuard.mkdir(backupPath, { recursive: true });

  // Copy current assets to backup
  const files = await listFilesRecursive(installedRoot);
  const filesToBackup = files.filter(
    (f) =>
      !f.startsWith(BACKUP_DIR) &&
      !f.startsWith('sandbox') &&
      !f.startsWith('logs') &&
      !f.startsWith('node_modules')
  );

  for (const relPath of filesToBackup) {
    const srcPath = path.join(installedRoot, relPath);
    const dstPath = path.join(backupPath, relPath);
    const dstDir = path.dirname(dstPath);

    if (existsSync(srcPath) && statSync(srcPath).isFile()) {
      await fileGuard.mkdir(dstDir, { recursive: true });
      await fileGuard.copyFileIntoRoot(srcPath, dstPath);
    }
  }

  logger.info(PHASE, `Backup created with ${filesToBackup.length} files`);

  // Prune old backups
  await pruneBackups(backupDir, MAX_BACKUPS, fileGuard, logger);

  return backupPath;
}

/**
 * Prunes old backups, keeping only the most recent ones.
 * @param {string} backupDir - Backup directory
 * @param {number} maxBackups - Maximum backups to keep
 * @param {Object} fileGuard - File guard instance
 * @param {Object} logger - Logger instance
 */
async function pruneBackups(backupDir, maxBackups, fileGuard, logger) {
  if (!existsSync(backupDir)) return;

  const entries = await readdir(backupDir, { withFileTypes: true });
  const backups = entries
    .filter((e) => e.isDirectory())
    .map((e) => ({
      name: e.name,
      path: path.join(backupDir, e.name),
    }))
    .sort((a, b) => b.name.localeCompare(a.name)); // Newest first

  if (backups.length > maxBackups) {
    const toDelete = backups.slice(maxBackups);
    for (const backup of toDelete) {
      logger.info(PHASE, `Pruning old backup: ${backup.name}`);
      await fileGuard.remove(backup.path, { recursive: true, force: true });
    }
  }
}

/**
 * Applies the mirror upgrade strategy.
 * @param {string} shippedRoot - Shipped assets root
 * @param {string} installedRoot - Installed assets root
 * @param {UpgradeAnalysis} analysis - Upgrade analysis
 * @param {Object} fileGuard - File guard instance
 * @param {Object} logger - Logger instance
 * @returns {Promise<string[]>} - Actions taken
 */
async function applyMirror(shippedRoot, installedRoot, analysis, fileGuard, logger) {
  const actions = [];
  logger.info(PHASE, 'Applying mirror strategy');

  // Get all shipped files
  const shippedFiles = await listFilesRecursive(shippedRoot);
  const relevantFiles = shippedFiles.filter(
    (f) =>
      !f.startsWith('node_modules') &&
      !f.startsWith('logs') &&
      !f.startsWith('backup') &&
      !f.startsWith('sandbox')
  );

  for (const relPath of relevantFiles) {
    const srcPath = path.join(shippedRoot, relPath);
    const dstPath = path.join(installedRoot, relPath);
    const dstDir = path.dirname(dstPath);

    await fileGuard.mkdir(dstDir, { recursive: true });
    await fileGuard.copyFileIntoRoot(srcPath, dstPath);
    actions.push(`Mirrored: ${relPath}`);
  }

  logger.info(PHASE, `Mirror complete: ${actions.length} files updated`);
  return actions;
}

/**
 * Applies the merge upgrade strategy.
 * @param {string} shippedRoot - Shipped assets root
 * @param {string} installedRoot - Installed assets root
 * @param {UpgradeAnalysis} analysis - Upgrade analysis
 * @param {Object} fileGuard - File guard instance
 * @param {Object} logger - Logger instance
 * @param {boolean} autoApprove - Auto-approve conflicts
 * @returns {Promise<string[]>} - Actions taken
 */
async function applyMerge(shippedRoot, installedRoot, analysis, fileGuard, logger, autoApprove) {
  const actions = [];
  logger.info(PHASE, 'Applying merge strategy');

  // Get all shipped files
  const shippedFiles = await listFilesRecursive(shippedRoot);
  const relevantFiles = shippedFiles.filter(
    (f) =>
      !f.startsWith('node_modules') &&
      !f.startsWith('logs') &&
      !f.startsWith('backup') &&
      !f.startsWith('sandbox')
  );

  for (const relPath of relevantFiles) {
    const srcPath = path.join(shippedRoot, relPath);
    const dstPath = path.join(installedRoot, relPath);
    const dstDir = path.dirname(dstPath);

    await fileGuard.mkdir(dstDir, { recursive: true });

    // Check if this is a pristine, modified, or conflict asset
    if (analysis.pristineAssets.includes(relPath) || !existsSync(dstPath)) {
      // Auto-update pristine or new files
      await fileGuard.copyFileIntoRoot(srcPath, dstPath);
      actions.push(`Updated: ${relPath}`);
    } else if (analysis.modifiedAssets.includes(relPath)) {
      const hint = analysis.diffHints[relPath];
      if (hint && hint.action === 'update') {
        // Upstream changed, local pristine - safe to update
        await fileGuard.copyFileIntoRoot(srcPath, dstPath);
        actions.push(`Auto-merged: ${relPath}`);
      } else {
        // Local modifications - prompt or skip
        const overwrite = await promptYesNo(
          `  Overwrite local changes in ${relPath}?`,
          autoApprove
        );
        if (overwrite) {
          await fileGuard.copyFileIntoRoot(srcPath, dstPath);
          actions.push(`Overwrote: ${relPath}`);
        } else {
          actions.push(`Kept local: ${relPath}`);
        }
      }
    } else if (analysis.conflictAssets.includes(relPath)) {
      // Conflict - requires resolution
      console.log(`\n⚠️  Conflict: ${relPath}`);
      console.log('   Both local and upstream have changes.');

      const overwrite = await promptYesNo('   Use upstream version?', autoApprove);
      if (overwrite) {
        await fileGuard.copyFileIntoRoot(srcPath, dstPath);
        actions.push(`Resolved (upstream): ${relPath}`);
      } else {
        actions.push(`Resolved (kept local): ${relPath}`);
      }
    }
  }

  logger.info(PHASE, `Merge complete: ${actions.length} actions`);
  return actions;
}

/**
 * Applies the sandbox upgrade strategy.
 * @param {string} shippedRoot - Shipped assets root
 * @param {string} installedRoot - Installed assets root
 * @param {string} targetVersion - Target version
 * @param {Object} fileGuard - File guard instance
 * @param {Object} logger - Logger instance
 * @returns {Promise<{sandboxPath: string, actions: string[]}>}
 */
async function applySandbox(shippedRoot, installedRoot, targetVersion, fileGuard, logger) {
  const actions = [];
  const sandboxPath = path.join(installedRoot, 'sandbox', `v${targetVersion}`);

  logger.info(PHASE, `Applying sandbox strategy to ${sandboxPath}`);

  await fileGuard.mkdir(sandboxPath, { recursive: true });

  // Get all shipped files
  const shippedFiles = await listFilesRecursive(shippedRoot);
  const relevantFiles = shippedFiles.filter(
    (f) =>
      !f.startsWith('node_modules') &&
      !f.startsWith('logs') &&
      !f.startsWith('backup') &&
      !f.startsWith('sandbox')
  );

  for (const relPath of relevantFiles) {
    const srcPath = path.join(shippedRoot, relPath);
    const dstPath = path.join(sandboxPath, relPath);
    const dstDir = path.dirname(dstPath);

    await fileGuard.mkdir(dstDir, { recursive: true });
    await fileGuard.copyFileIntoRoot(srcPath, dstPath);
    actions.push(`Extracted: ${relPath}`);
  }

  logger.info(PHASE, `Sandbox created: ${actions.length} files`);
  return { sandboxPath, actions };
}

/**
 * Updates asset tracking after upgrade.
 * @param {string} installedRoot - Installed assets root
 * @param {string} shippedRoot - Shipped assets root
 * @param {string} targetVersion - Target version
 * @param {Object} fileGuard - File guard instance
 * @param {Object} logger - Logger instance
 */
async function updateAssetTracking(installedRoot, shippedRoot, targetVersion, fileGuard, logger) {
  logger.info(PHASE, 'Updating asset tracking');

  const assetsPath = path.join(installedRoot, ASSETS_FILE);
  const assets = {};

  const shippedFiles = await listFilesRecursive(shippedRoot);
  const relevantFiles = shippedFiles.filter(
    (f) =>
      !f.startsWith('node_modules') &&
      !f.startsWith('logs') &&
      !f.startsWith('backup') &&
      !f.startsWith('sandbox')
  );

  for (const relPath of relevantFiles) {
    const installedPath = path.join(installedRoot, relPath);
    const shippedPath = path.join(shippedRoot, relPath);

    if (existsSync(installedPath)) {
      const localChecksum = computeChecksumSync(installedPath);
      const frameworkChecksum = computeChecksumSync(shippedPath);

      assets[relPath] = {
        frameworkChecksum,
        localChecksum,
        frameworkVersion: targetVersion,
        lastModified: new Date().toISOString(),
        status: localChecksum === frameworkChecksum ? 'pristine' : 'modified',
      };
    }
  }

  await fileGuard.writeFile(assetsPath, JSON.stringify({ assets }, null, 2), 'utf8');
  logger.info(PHASE, `Asset tracking updated: ${Object.keys(assets).length} assets`);
}

/**
 * Updates the manifest.json with upgrade history.
 * @param {string} installedRoot - Installed assets root
 * @param {string} fromVersion - Previous version
 * @param {string} toVersion - New version
 * @param {UpgradeStrategy} strategy - Strategy used
 * @param {Object} fileGuard - File guard instance
 * @param {Object} logger - Logger instance
 */
async function updateManifest(installedRoot, fromVersion, toVersion, strategy, fileGuard, logger) {
  const manifestPath = path.join(installedRoot, MANIFEST_FILE);
  let manifest = await readManifest(manifestPath);

  if (!manifest) {
    manifest = {
      frameworkVersion: toVersion,
      installedAt: new Date().toISOString(),
      upgradeHistory: [],
    };
  }

  manifest.frameworkVersion = toVersion;
  manifest.upgradeHistory = manifest.upgradeHistory || [];
  manifest.upgradeHistory.push({
    from: fromVersion,
    to: toVersion,
    at: new Date().toISOString(),
    strategy,
  });

  await fileGuard.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  logger.info(PHASE, 'Manifest updated');
}

/**
 * Updates the VERSION file.
 * @param {string} installedRoot - Installed assets root
 * @param {string} version - New version
 * @param {Object} fileGuard - File guard instance
 */
async function updateVersionFile(installedRoot, version, fileGuard) {
  const versionPath = path.join(installedRoot, VERSION_FILE);
  await fileGuard.writeFile(versionPath, version, 'utf8');
}

/**
 * Writes upgrade log entry.
 * @param {string} installedRoot - Installed assets root
 * @param {Object} logData - Log data
 * @param {Object} fileGuard - File guard instance
 * @returns {Promise<string>} - Log file path
 */
async function writeUpgradeLog(installedRoot, logData, fileGuard) {
  const logsDir = path.join(installedRoot, LOGS_DIR);
  await fileGuard.mkdir(logsDir, { recursive: true });

  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const logPath = path.join(logsDir, `upgrade-${datePart}.ndjson`);

  const entry = {
    timestamp: new Date().toISOString(),
    event: 'upgrade_complete',
    from: logData.fromVersion,
    to: logData.toVersion,
    strategy: logData.strategy,
    actionsCount: logData.actions.length,
    backupPath: logData.backupPath,
    requirementId: REQUIREMENT_ID,
  };

  await fileGuard.writeFile(logPath, JSON.stringify(entry) + '\n', { flag: 'a', encoding: 'utf8' });

  return logPath;
}

/**
 * Saves upgrade hints to file.
 * @param {string} installedRoot - Installed assets root
 * @param {string} targetVersion - Target version
 * @param {Object} diffHints - Diff hints
 * @param {Object} fileGuard - File guard instance
 */
async function saveUpgradeHints(installedRoot, targetVersion, diffHints, fileGuard) {
  const hintsDir = path.join(installedRoot, UPGRADE_HINTS_DIR);
  await fileGuard.mkdir(hintsDir, { recursive: true });

  const hintsPath = path.join(hintsDir, `v${targetVersion}.json`);
  const hintsData = {
    version: targetVersion,
    generatedAt: new Date().toISOString(),
    assets: diffHints,
  };

  await fileGuard.writeFile(hintsPath, JSON.stringify(hintsData, null, 2), 'utf8');
}

/**
 * Runs the upgrade command.
 * @param {UpgradeOptions} [options] - Upgrade options
 * @returns {Promise<{success: boolean, analysis: UpgradeAnalysis, actions: string[], logPath: string}>}
 */
export async function runUpgrade(options = {}) {
  const cwd = options.cwd || process.cwd();
  const shippedRoot = options.shippedRoot || DEFAULT_SHIPPED_ROOT;
  const installedRoot = path.join(cwd, DEFAULT_INSTALLED_ROOT_SEGMENT);
  const verbose = options.verbose || false;
  const autoApprove = options.autoApprove || false;
  const analyzeOnly = options.analyze || false;
  const force = options.force || false;

  const logger = createLogger({
    devCycleId: 'upgrade',
    includeConsole: verbose,
  });

  const fileGuard = createFileGuard({
    allowedRoot: installedRoot,
    autoApprove,
  });

  const firewall = createBadVibesFirewall({
    autoApprove,
    stateDir: path.join(installedRoot, 'genaiscript', 'state'),
    logsDir: path.join(installedRoot, LOGS_DIR),
  });

  logger.requirement(PHASE, REQUIREMENT_ID, 'Starting upgrade command');
  logger.info(PHASE, 'Configuration', {
    cwd,
    shippedRoot,
    installedRoot,
    analyzeOnly,
    autoApprove,
    refs: [REQUIREMENT_ID, PRD_REF, SPEC_REF, ADR_REF],
  });

  // Ensure installed root exists
  if (!existsSync(installedRoot)) {
    await fileGuard.mkdir(installedRoot, { recursive: true });
  }

  // Run analysis
  const analysis = await analyzeUpgrade(shippedRoot, installedRoot, logger);

  // Display analysis
  console.log(formatAnalysis(analysis));

  // Save upgrade hints
  if (Object.keys(analysis.diffHints).length > 0) {
    await saveUpgradeHints(installedRoot, analysis.targetVersion, analysis.diffHints, fileGuard);
  }

  // If analyze-only, stop here
  if (analyzeOnly) {
    logger.info(PHASE, 'Analysis complete (--analyze mode)');
    await logger.close();
    return {
      success: true,
      analysis,
      actions: [],
      logPath: '',
    };
  }

  // Check if upgrade is needed
  if (!analysis.upgradeAvailable) {
    if (analysis.versionBump === 'downgrade') {
      console.log('\n❌ Cannot downgrade. Target version is older than installed version.');
    } else {
      console.log('\n✅ No upgrade needed. You are running the latest version.');
    }
    await logger.close();
    return {
      success: true,
      analysis,
      actions: [],
      logPath: '',
    };
  }

  // Check for major version and require force flag
  if (analysis.versionBump === 'major' && !force) {
    console.log('\n❌ Major version upgrade requires --force flag.');
    console.log('   Review breaking changes before proceeding.');
    await logger.close();
    return {
      success: false,
      analysis,
      actions: [],
      logPath: '',
    };
  }

  // Get strategy
  let strategy = options.strategy;
  if (!strategy) {
    strategy = await promptStrategy(autoApprove);
  }

  logger.info(PHASE, `Strategy selected: ${strategy}`);

  // Bad Vibes Firewall approval
  const firewallResult = await firewall.guard(
    COMMON_OPERATIONS.upgrade(analysis.currentVersion, analysis.targetVersion)
  );

  if (!firewallResult.approved) {
    console.log('\n❌ Upgrade aborted by user.');
    await logger.close();
    return {
      success: false,
      analysis,
      actions: [],
      logPath: '',
    };
  }

  // Create backup
  const backupPath = await createBackup(installedRoot, analysis.currentVersion, fileGuard, logger);
  console.log(`\n📦 Backup created: ${backupPath}`);

  // Apply strategy
  let actions = [];
  let sandboxPath = null;

  if (strategy === 'mirror') {
    actions = await applyMirror(shippedRoot, installedRoot, analysis, fileGuard, logger);
  } else if (strategy === 'merge') {
    actions = await applyMerge(
      shippedRoot,
      installedRoot,
      analysis,
      fileGuard,
      logger,
      autoApprove
    );
  } else if (strategy === 'sandbox') {
    const result = await applySandbox(
      shippedRoot,
      installedRoot,
      analysis.targetVersion,
      fileGuard,
      logger
    );
    sandboxPath = result.sandboxPath;
    actions = result.actions;
  }

  // Update tracking (skip for sandbox)
  if (strategy !== 'sandbox') {
    await updateVersionFile(installedRoot, analysis.targetVersion, fileGuard);
    await updateAssetTracking(installedRoot, shippedRoot, analysis.targetVersion, fileGuard, logger);
    await updateManifest(
      installedRoot,
      analysis.currentVersion,
      analysis.targetVersion,
      strategy,
      fileGuard,
      logger
    );
  }

  // Write upgrade log
  const logPath = await writeUpgradeLog(
    installedRoot,
    {
      fromVersion: analysis.currentVersion,
      toVersion: analysis.targetVersion,
      strategy,
      actions,
      backupPath,
    },
    fileGuard
  );

  // Final output
  console.log('');
  console.log('═'.repeat(60));
  console.log('✅ UPGRADE COMPLETE');
  console.log('═'.repeat(60));
  console.log(`   From: v${analysis.currentVersion}`);
  console.log(`   To:   v${analysis.targetVersion}`);
  console.log(`   Strategy: ${strategy}`);
  console.log(`   Actions: ${actions.length}`);
  console.log(`   Backup: ${backupPath}`);
  console.log(`   Log: ${logPath}`);

  if (sandboxPath) {
    console.log(`   Sandbox: ${sandboxPath}`);
    console.log('');
    console.log('   📦 Sandbox commands:');
    console.log(`      loaded-vibes sandbox diff <asset>`);
    console.log(`      loaded-vibes sandbox apply <asset>`);
    console.log(`      loaded-vibes sandbox apply --all`);
    console.log(`      loaded-vibes sandbox discard`);
  } else {
    console.log('');
    console.log('   💡 To rollback:');
    console.log(`      loaded-vibes restore --from ${path.basename(backupPath)}`);
  }

  console.log('');
  console.log(`   Requirement: ${REQUIREMENT_ID}, ${PRD_REF}`);
  console.log('═'.repeat(60));

  logger.requirement(PHASE, REQUIREMENT_ID, 'Upgrade complete');
  await logger.close();

  return {
    success: true,
    analysis,
    actions,
    logPath,
  };
}

/**
 * CLI entry point for upgrade command.
 * @returns {Promise<void>}
 */
export async function runUpgradeCli() {
  const args = process.argv.slice(2).filter((arg) => arg !== 'upgrade');
  const options = parseArgs(args);

  const result = await runUpgrade(options);
  process.exit(result.success ? 0 : 1);
}

/**
 * Parses CLI arguments.
 * @param {string[]} argv - Arguments
 * @returns {UpgradeOptions}
 */
function parseArgs(argv) {
  const options = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    switch (arg) {
      case '--strategy':
        options.strategy = argv[i + 1];
        i++;
        break;
      case '--analyze':
      case '-a':
        options.analyze = true;
        break;
      case '--yes':
      case '-y':
        options.autoApprove = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--force':
      case '-f':
        options.force = true;
        break;
      case '--cwd':
        options.cwd = argv[i + 1];
        i++;
        break;
      default:
        break;
    }
  }

  return options;
}

/**
 * Detect direct execution.
 */
function isRunningDirectly() {
  if (!process.argv[1]) return false;
  const scriptPath = fileURLToPath(import.meta.url);
  return path.resolve(process.argv[1]) === scriptPath;
}

if (isRunningDirectly()) {
  runUpgradeCli().catch((err) => {
    console.error('Upgrade command failed:', err);
    process.exit(1);
  });
}
