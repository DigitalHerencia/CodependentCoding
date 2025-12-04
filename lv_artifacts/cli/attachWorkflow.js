/**
 * Loaded Vibes Retrofit / Attach Workflow
 *
 * Provides `--attach` support for create-loaded-vibes / loaded-vibes init.
 * Detects existing assets, enumerates conflicts, applies Mirror / Merge /
 * Sandbox strategies, and writes install logs to `.loaded-vibes/logs/install-YYYYMMDD.md`
 * with requirement citations. Aligns with PRD §5.1 and TECH_REQUIREMENTS §5.1.
 *
 * @module dist/cli/attachWorkflow
 * @see docs/PRD.md §5.1
 * @see docs/TECH_REQUIREMENTS.md §5.1
 * @see spec/cli.spec.md §3
 */

import { createHash } from 'crypto';
import { createInterface } from 'readline';
import { existsSync, statSync, readFileSync, mkdirSync } from 'fs';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createFileGuard } from './security/fileGuard.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SOURCE_ROOT = path.resolve(CURRENT_DIR, '..'); // dist/**
const DEFAULT_FOCUS_SEGMENTS = [
  '.github',
  '.vscode',
  '.genaiscript',
  'cli',
  'docs',
  'genaiscript',
  'scripts',
  'src',
];
const REQUIREMENT_ID = 'PRD §5.1';

/**
 * Recursively list files under a directory.
 * @param {string} dir
 * @param {string} [prefix]
 * @returns {Promise<string[]>}
 */
async function listFiles(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relPath = path.join(prefix, entry.name);
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const childFiles = await listFiles(fullPath, relPath);
      files.push(...childFiles);
    } else if (entry.isFile()) {
      files.push(relPath);
    }
  }

  return files;
}

/**
 * Generates SHA256 hash of a file.
 * @param {string} filePath
 * @returns {string}
 */
function hashFile(filePath) {
  const buffer = readFileSync(filePath);
  const hash = createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

/**
 * Builds a map of file hashes keyed by relative path.
 * @param {string} baseDir
 * @param {string[]} files
 * @returns {Map<string, string>}
 */
function buildHashMap(baseDir, files) {
  const map = new Map();
  for (const relPath of files) {
    const fullPath = path.join(baseDir, relPath);
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      map.set(relPath, hashFile(fullPath));
    }
  }
  return map;
}

/**
 * Detects whether the target directory already contains repo assets.
 * @param {string} targetDir
 * @returns {{targetDir:string, repoDetected:boolean, indicators:string[]}}
 */
function detectExistingRepo(targetDir) {
  const repoIndicators = ['.git', '.github', '.vscode', '.loaded-vibes', 'package.json'];
  const indicators = repoIndicators.filter((name) => existsSync(path.join(targetDir, name)));

  return {
    targetDir: path.resolve(targetDir),
    repoDetected: indicators.length > 0,
    indicators,
  };
}

/**
 * Enumerates conflicts between shipped assets and the destination `.loaded-vibes` folder.
 * Focuses on `.github`, `.vscode`, and the shipped dist payload (docs/genaiscript/scripts/src) per acceptance criteria.
 * @param {string} sourceRoot
 * @param {string} destinationRoot
 * @param {string[]} focusSegments
 * @returns {Promise<Array<{segment:string, exists:boolean, conflicts:string[], newFiles:string[]}>>}
 */
async function enumerateConflicts(
  sourceRoot,
  destinationRoot,
  focusSegments = DEFAULT_FOCUS_SEGMENTS
) {
  const results = [];

  for (const segment of focusSegments) {
    const sourcePath = path.join(sourceRoot, segment);
    if (!existsSync(sourcePath)) {
      continue;
    }

    const destinationPath = path.join(destinationRoot, segment);
    const destExists = existsSync(destinationPath);

    const sourceFiles = await listFiles(sourcePath);
    const sourceMap = buildHashMap(sourcePath, sourceFiles);
    const destFiles = destExists ? await listFiles(destinationPath) : [];
    const destMap = destExists ? buildHashMap(destinationPath, destFiles) : new Map();

    const conflicts = [];
    const newFiles = [];

    for (const relPath of sourceFiles) {
      const sourceHash = sourceMap.get(relPath);
      const destHash = destMap.get(relPath);

      if (destHash === undefined) {
        newFiles.push(relPath);
      } else if (destHash !== sourceHash) {
        conflicts.push(relPath);
      }
    }

    results.push({
      segment,
      exists: destExists,
      conflicts,
      newFiles,
      destinationPath,
    });
  }

  return results;
}

/**
 * Prompts the user for confirmation; defaults to false when non-interactive.
 * @param {string} question
 * @param {boolean} defaultValue
 * @returns {Promise<boolean>}
 */
async function promptYesNo(question, defaultValue = false) {
  if (!process.stdin.isTTY) {
    return defaultValue;
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase().startsWith('y'));
    });
  });
}

/**
 * Mirrors shipped assets into `.loaded-vibes`, replacing existing content.
 * @param {string} sourceRoot
 * @param {string} destinationRoot
 * @param {string[]} focusSegments
 * @returns {Promise<string[]>} - Action log entries
 */
async function applyMirror(
  sourceRoot,
  destinationRoot,
  focusSegments = DEFAULT_FOCUS_SEGMENTS,
  fileGuard = createFileGuard({ allowedRoot: destinationRoot })
) {
  const actions = [];
  await fileGuard.mkdir(destinationRoot, { recursive: true });

  for (const segment of focusSegments) {
    const src = path.join(sourceRoot, segment);
    const dst = path.join(destinationRoot, segment);
    if (!existsSync(src)) continue;

    if (existsSync(dst)) {
      await fileGuard.remove(dst, { recursive: true, force: true });
      actions.push(`Removed existing ${dst}`);
    }

    await fileGuard.copyIntoRoot(src, dst, { recursive: true });
    actions.push(`Mirrored ${segment} from dist into ${dst}`);
  }

  return actions;
}

/**
 * Merges shipped assets into `.loaded-vibes`, prompting on conflicts.
 * @param {string} sourceRoot
 * @param {string} destinationRoot
 * @param {string[]} focusSegments
 * @param {{autoApprove?:boolean}} [options]
 * @returns {Promise<string[]>} - Action log entries
 */
async function applyMerge(
  sourceRoot,
  destinationRoot,
  focusSegments = DEFAULT_FOCUS_SEGMENTS,
  options = {},
  fileGuard = createFileGuard({ allowedRoot: destinationRoot, autoApprove: options.autoApprove })
) {
  const actions = [];
  const autoApprove = options.autoApprove || false;

  await fileGuard.mkdir(destinationRoot, { recursive: true });

  for (const segment of focusSegments) {
    const srcBase = path.join(sourceRoot, segment);
    if (!existsSync(srcBase)) continue;

    const dstBase = path.join(destinationRoot, segment);
    const files = await listFiles(srcBase);

    for (const relPath of files) {
      const sourceFile = path.join(srcBase, relPath);
      const destFile = path.join(dstBase, relPath);
      const destDir = path.dirname(destFile);
      await fileGuard.mkdir(destDir, { recursive: true });

      if (!existsSync(destFile)) {
        await fileGuard.copyFileIntoRoot(sourceFile, destFile);
        actions.push(`Added ${destFile}`);
        continue;
      }

      const sourceHash = hashFile(sourceFile);
      const destHash = hashFile(destFile);

      if (sourceHash === destHash) {
        continue; // identical
      }

      const overwrite =
        autoApprove ||
        (await promptYesNo(`Conflict at ${destFile}. Overwrite with shipped version?`, false));
      if (overwrite) {
        await fileGuard.copyFileIntoRoot(sourceFile, destFile);
        actions.push(`Overwrote ${destFile} with shipped version`);
      } else {
        actions.push(`Kept existing ${destFile} (user declined overwrite)`);
      }
    }
  }

  return actions;
}

/**
 * Copies shipped assets into sandbox folder under `.loaded-vibes/sandbox/<timestamp>`.
 * @param {string} sourceRoot
 * @param {string} destinationRoot
 * @param {string[]} focusSegments
 * @returns {Promise<{sandboxPath:string, actions:string[]}>}
 */
async function applySandbox(
  sourceRoot,
  destinationRoot,
  focusSegments = DEFAULT_FOCUS_SEGMENTS,
  fileGuard = createFileGuard({ allowedRoot: destinationRoot })
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sandboxPath = path.join(destinationRoot, 'sandbox', timestamp);
  const actions = [];

  await fileGuard.mkdir(sandboxPath, { recursive: true });

  for (const segment of focusSegments) {
    const src = path.join(sourceRoot, segment);
    if (!existsSync(src)) continue;

    const dst = path.join(sandboxPath, segment);
    await fileGuard.copyIntoRoot(src, dst, { recursive: true });
    actions.push(`Copied ${segment} into sandbox at ${dst}`);
  }

  return { sandboxPath, actions };
}

/**
 * Writes a Markdown install log entry to `.loaded-vibes/logs/install-YYYYMMDD.md`.
 * @param {string} destinationRoot
 * @param {Object} logData
 * @returns {Promise<string>} - Log file path
 */
async function writeInstallLog(
  destinationRoot,
  logData,
  fileGuard = createFileGuard({ allowedRoot: destinationRoot })
) {
  const logsDir = path.join(destinationRoot, 'logs');
  await fileGuard.mkdir(logsDir, { recursive: true });

  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const logPath = path.join(logsDir, `install-${datePart}.md`);

  const lines = [];
  lines.push(`# Loaded Vibes Install Log (${logData.strategy})`);
  lines.push('');
  lines.push(`- Timestamp: ${logData.timestamp}`);
  lines.push(`- Target: ${logData.targetDir}`);
  lines.push(`- Strategy: ${logData.strategy}`);
  lines.push(`- Requirement: ${REQUIREMENT_ID}`);
  lines.push(
    `- Repo detected: ${logData.repoDetected ? `yes (${logData.indicators.join(', ')})` : 'no'}`
  );
  lines.push(`- Conflicts scanned: ${logData.conflicts.length}`);
  lines.push('');

  if (logData.conflicts.length > 0) {
    lines.push('## Conflicts');
    for (const conflict of logData.conflicts) {
      lines.push(
        `- ${conflict.segment}: ${conflict.conflicts.length} differing file(s), ` +
          `${conflict.newFiles.length} new file(s) to copy`
      );
      if (conflict.conflicts.length > 0) {
        lines.push(
          `  - Paths: ${conflict.conflicts.slice(0, 5).join(', ')}${
            conflict.conflicts.length > 5 ? ' …' : ''
          }`
        );
      }
    }
    lines.push('');
  }

  if (logData.actions.length > 0) {
    lines.push('## Actions');
    for (const action of logData.actions) {
      lines.push(`- ${action}`);
    }
    lines.push('');
  }

  if (logData.approvals && logData.approvals.length > 0) {
    lines.push('## Approvals & Decisions');
    for (const decision of logData.approvals) {
      lines.push(`- ${decision}`);
    }
    lines.push('');
  }

  const prefix = existsSync(logPath) ? '\n\n---\n' : '';
  await fileGuard.writeFile(logPath, `${prefix}${lines.join('\n')}`, {
    flag: 'a',
    encoding: 'utf8',
  });
  return logPath;
}

/**
 * Runs the attach workflow end-to-end.
 * @param {{targetDir:string, strategy:'mirror'|'merge'|'sandbox', autoApprove?:boolean, sourceRoot?:string}} options
 * @returns {Promise<{logPath:string, actions:string[]}>}
 */
async function runAttachWorkflow(options) {
  const targetDir = path.resolve(options.targetDir || process.cwd());
  const strategy = options.strategy || 'merge';
  const autoApprove = options.autoApprove || false;
  const sourceRoot = options.sourceRoot || DEFAULT_SOURCE_ROOT;
  const destinationRoot = path.join(targetDir, '.loaded-vibes');
  const fileGuard = createFileGuard({ allowedRoot: destinationRoot, autoApprove });

  const repoInfo = detectExistingRepo(targetDir);
  const conflicts = await enumerateConflicts(sourceRoot, destinationRoot, DEFAULT_FOCUS_SEGMENTS);

  let actions = [];
  const approvals = [];

  if (strategy === 'mirror') {
    const confirmed =
      autoApprove ||
      (await promptYesNo('Mirror will replace existing .loaded-vibes assets. Continue?', false));
    approvals.push(`Mirror approved: ${confirmed}`);
    if (!confirmed) {
      throw new Error('Mirror aborted by user');
    }
    actions = await applyMirror(sourceRoot, destinationRoot, DEFAULT_FOCUS_SEGMENTS);
  } else if (strategy === 'merge') {
    actions = await applyMirror(sourceRoot, destinationRoot, DEFAULT_FOCUS_SEGMENTS, fileGuard);
    autoApprove,
      (actions = await applyMerge(
        sourceRoot,
        destinationRoot,
        DEFAULT_FOCUS_SEGMENTS,
        { autoApprove },
        fileGuard
      ));
  } else if (strategy === 'sandbox') {
    const sandboxResult = await applySandbox(
      sourceRoot,
      destinationRoot,
      DEFAULT_FOCUS_SEGMENTS,
      fileGuard
    );
    actions = sandboxResult.actions;
    approvals.push(`Sandbox location: ${sandboxResult.sandboxPath}`);
  } else {
    throw new Error(`Unknown strategy: ${strategy}`);
  }

  const logPath = await writeInstallLog(
    destinationRoot,
    {
      timestamp: new Date().toISOString(),
      targetDir,
      strategy,
      repoDetected: repoInfo.repoDetected,
      indicators: repoInfo.indicators,
      conflicts,
      actions,
      approvals,
    },
    fileGuard
  );

  return { logPath, actions, conflicts };
}

/**
 * Basic argument parser for CLI usage.
 * Supports:
 *  --attach / --target <path>
 *  --strategy mirror|merge|sandbox
 *  --yes (auto-approve)
 *  --source <path> (override shipped dist root)
 */
function parseArgs(argv) {
  const args = { strategy: 'merge', autoApprove: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--attach':
      case '--target':
        args.targetDir = argv[i + 1];
        i += 1;
        break;
      case '--strategy':
        args.strategy = argv[i + 1];
        i += 1;
        break;
      case '--yes':
      case '--auto-approve':
        args.autoApprove = true;
        break;
      case '--source':
        args.sourceRoot = argv[i + 1];
        i += 1;
        break;
      default:
        break;
    }
  }
  return args;
}

/**
 * CLI entrypoint for manual testing / bootstrap integration.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetDir = args.targetDir || process.cwd();

  if (!existsSync(targetDir) || !(await stat(targetDir)).isDirectory()) {
    console.error(`Target directory does not exist: ${targetDir}`);
    process.exit(1);
  }

  console.log('��������������������������������������������������������������ͻ');
  console.log('�        LOADED VIBES RETROFIT / ATTACH WORKFLOW               �');
  console.log('��������������������������������������������������������������ͼ');
  console.log(`Target: ${path.resolve(targetDir)}`);
  console.log(`Strategy: ${args.strategy}`);
  console.log('');

  try {
    const result = await runAttachWorkflow({
      targetDir,
      strategy: args.strategy,
      autoApprove: args.autoApprove,
      sourceRoot: args.sourceRoot,
    });

    console.log('? Conflict scan results:');
    result.conflicts.forEach((entry) => {
      console.log(
        `  - ${entry.segment}: ${entry.conflicts.length} conflict(s), ${entry.newFiles.length} new file(s)`
      );
    });

    console.log('? Attach workflow completed.');
    console.log(`? Actions: ${result.actions.length}`);
    console.log(`? Install log: ${result.logPath}`);
  } catch (error) {
    console.error('Attach workflow failed:', error.message);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}

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
};
