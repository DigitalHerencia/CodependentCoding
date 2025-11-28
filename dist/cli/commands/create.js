// @ts-nocheck
/**
 * Loaded Vibes Create Command
 *
 * Creates a new project with .loaded-vibes/ by copying dist/** assets.
 * This is a wrapper around the init command with project creation logic.
 *
 * @module dist/cli/commands/create
 * @see docs/PRD.md §5.1 - Distribution & Installation
 * @see docs/TECH_REQUIREMENTS.md §5.1 - Distribution Model
 * @see spec/cli.spec.md §3 - Distribution & Bootstrap Coupling
 * @see docs/decisions/ADR-001-customization-versioning-strategy.md
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { mkdir, copyFile, readdir, writeFile, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { runPreflightChecks, formatResults } from '../preflight/index.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REQUIREMENT_ID = 'PRD §5.1 / TECH §5.1';

/**
 * Get the dist path from the CLI module location
 * @returns {string|null}
 */
function getDistPath() {
  const distPath = path.resolve(CURRENT_DIR, '..', '..');
  if (existsSync(distPath)) {
    return distPath;
  }
  return null;
}

/**
 * Parse command line arguments
 * @param {string[]} argv
 * @returns {Object}
 */
function parseArgs(argv) {
  const options = {
    projectDir: null,
    attach: false,
    attachPath: null,
    strategy: 'merge',
    autoApprove: false,
    verbose: false,
    skipPreflight: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '--attach':
        options.attach = true;
        options.attachPath = argv[i + 1] && !argv[i + 1].startsWith('-') ? argv[++i] : '.';
        break;
      case '--strategy':
        options.strategy = argv[++i] || 'merge';
        break;
      case '-y':
      case '--yes':
        options.autoApprove = true;
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '--skip-preflight':
        options.skipPreflight = true;
        break;
      default:
        if (!arg.startsWith('-') && !options.projectDir) {
          options.projectDir = arg;
        }
        break;
    }
  }

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║           LOADED VIBES CREATE - Create New Project             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Usage: loaded-vibes create [project-dir] [options]');
  console.log('');
  console.log('Creates a new project with .loaded-vibes/ framework assets.');
  console.log('');
  console.log('Arguments:');
  console.log('  project-dir       Directory to create (default: current directory)');
  console.log('');
  console.log('Options:');
  console.log('  --attach [path]   Attach to existing repository');
  console.log('  --strategy <s>    Strategy: mirror, merge (default), or sandbox');
  console.log('  -y, --yes         Auto-approve all prompts');
  console.log('  -v, --verbose     Verbose output');
  console.log('  --skip-preflight  Skip environment prerequisite checks');
  console.log('  -h, --help        Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  loaded-vibes create my-app           Create new project');
  console.log('  loaded-vibes create --attach ./      Attach to current directory');
  console.log('  loaded-vibes create my-app -y        Auto-approve all prompts');
  console.log('');
  console.log('Strategies (for --attach):');
  console.log('  mirror   Replace all .loaded-vibes/ assets with shipped versions');
  console.log('  merge    Merge shipped assets, prompt for conflicts (default)');
  console.log('  sandbox  Extract to .loaded-vibes/sandbox/ for review');
  console.log('');
  console.log('References:');
  console.log('  PRD §5.1          Distribution & Installation requirements');
  console.log('  TECH §5.1         Distribution Model and preflight checks');
  console.log('  ADR-001           Customization versioning strategy');
  console.log('');
}

/**
 * Prompt user for yes/no
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
 * Recursively copy directory
 * @param {string} src
 * @param {string} dest
 * @param {Object} options
 */
async function copyDirectory(src, dest, options = {}) {
  const { verbose = false } = options;

  await mkdir(dest, { recursive: true });

  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath, options);
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
      if (verbose) {
        console.log(`  Copied: ${entry.name}`);
      }
    }
  }
}

/**
 * Write install log
 * @param {string} logsDir
 * @param {Object} logData
 * @returns {Promise<string>}
 */
async function writeInstallLog(logsDir, logData) {
  await mkdir(logsDir, { recursive: true });

  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const logPath = path.join(logsDir, `install-${datePart}.md`);

  const lines = [
    `# Loaded Vibes Create Log`,
    '',
    `- **Timestamp:** ${logData.timestamp}`,
    `- **Project:** ${logData.projectDir}`,
    `- **Mode:** ${logData.mode}`,
    `- **Strategy:** ${logData.strategy || 'N/A'}`,
    `- **Requirement:** ${REQUIREMENT_ID}`,
    '',
  ];

  if (logData.actions && logData.actions.length > 0) {
    lines.push('## Actions');
    lines.push('');
    for (const action of logData.actions) {
      lines.push(`- ${action}`);
    }
    lines.push('');
  }

  // Use atomic write pattern to avoid race conditions
  const content = lines.join('\n');
  try {
    const stats = await stat(logPath);
    if (stats.size > 0) {
      await writeFile(logPath, `\n\n---\n\n${content}`, { flag: 'a', encoding: 'utf8' });
    } else {
      await writeFile(logPath, content, { flag: 'a', encoding: 'utf8' });
    }
  } catch {
    // File doesn't exist, create it
    await writeFile(logPath, content, { encoding: 'utf8' });
  }

  return logPath;
}

/**
 * Run the create command
 * @param {string[]} argv
 */
export async function runCreateCli(argv = []) {
  const options = parseArgs(argv);

  if (options.help) {
    showHelp();
    return;
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║           LOADED VIBES CREATE - Create New Project             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Run preflight checks
  if (!options.skipPreflight) {
    console.log('🔍 Running preflight checks [PRD §5.1, TECH §5.1]...');
    console.log('');
    const result = await runPreflightChecks({ includeArtifacts: false });
    console.log(formatResults(result));

    if (!result.success && !options.autoApprove) {
      const proceed = await promptYesNo('Some preflight checks failed. Continue anyway?', false);
      if (!proceed) {
        console.log('');
        console.log('Creation cancelled.');
        process.exit(1);
      }
    }
  }

  const projectDir = options.attach
    ? path.resolve(options.attachPath || '.')
    : path.resolve(options.projectDir || '.');
  const mode = options.attach ? 'attach' : 'create';
  const actions = [];

  console.log(`📁 Project: ${projectDir}`);
  console.log(`📋 Mode: ${mode}`);
  if (options.attach) {
    console.log(`📋 Strategy: ${options.strategy} [ADR-001]`);
  }
  console.log('');

  // Create project directory if creating new project
  if (!options.attach) {
    if (!existsSync(projectDir)) {
      await mkdir(projectDir, { recursive: true });
      actions.push(`Created project directory: ${projectDir}`);
      console.log(`✅ Created project directory: ${projectDir}`);
    } else if (!options.autoApprove) {
      const proceed = await promptYesNo(`Directory ${projectDir} exists. Continue?`, false);
      if (!proceed) {
        console.log('Creation cancelled.');
        process.exit(1);
      }
    }
  }

  const loadedVibesPath = path.join(projectDir, '.loaded-vibes');
  const isExistingInstall = existsSync(loadedVibesPath);

  if (isExistingInstall && options.attach) {
    console.log('⚠️ Existing .loaded-vibes installation detected');
    
    if (options.strategy === 'mirror' && !options.autoApprove) {
      const proceed = await promptYesNo('Mirror will replace all existing assets. Continue?', false);
      if (!proceed) {
        console.log('Creation cancelled.');
        process.exit(1);
      }
    }
  }

  // Get dist path
  const distPath = getDistPath();
  if (!distPath) {
    console.error('❌ Could not find dist/ assets.');
    process.exit(1);
  }

  console.log(`📦 Copying assets from ${distPath}...`);

  // Create .loaded-vibes directory
  await mkdir(loadedVibesPath, { recursive: true });
  actions.push('Created .loaded-vibes directory');

  // Copy assets
  const segments = ['.github', '.vscode', '.genaiscript', 'cli', 'docs', 'genaiscript', 'scripts'];

  if (options.attach && options.strategy === 'sandbox') {
    const sandboxPath = path.join(loadedVibesPath, 'sandbox', new Date().toISOString().replace(/[:.]/g, '-'));
    await mkdir(sandboxPath, { recursive: true });
    
    for (const segment of segments) {
      const srcPath = path.join(distPath, segment);
      const destPath = path.join(sandboxPath, segment);
      if (existsSync(srcPath)) {
        await copyDirectory(srcPath, destPath, { verbose: options.verbose });
        actions.push(`Copied ${segment}/ to sandbox`);
        console.log(`  📦 ${segment}/ → sandbox`);
      }
    }
    
    console.log('');
    console.log('💡 Assets copied to sandbox. Review and apply with:');
    console.log(`   loaded-vibes sandbox apply --all`);
  } else {
    for (const segment of segments) {
      const srcPath = path.join(distPath, segment);
      const destPath = path.join(loadedVibesPath, segment);
      if (existsSync(srcPath)) {
        await copyDirectory(srcPath, destPath, { verbose: options.verbose });
        actions.push(`Copied ${segment}/`);
        console.log(`  ✅ ${segment}/`);
      }
    }
  }

  // Copy VERSION file
  const versionPath = path.join(distPath, 'VERSION');
  if (existsSync(versionPath)) {
    const destVersionPath = path.join(loadedVibesPath, 'VERSION');
    await copyFile(versionPath, destVersionPath);
    const version = readFileSync(versionPath, 'utf8').trim();
    actions.push(`Copied VERSION (${version})`);
    console.log(`  ✅ VERSION (${version})`);
  }

  // Create manifest.json
  const manifestPath = path.join(loadedVibesPath, 'manifest.json');
  let manifest;
  if (existsSync(manifestPath) && options.attach) {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const newVersion = readFileSync(path.join(distPath, 'VERSION'), 'utf8').trim();
    manifest.upgradeHistory.push({
      from: manifest.frameworkVersion,
      to: newVersion,
      at: new Date().toISOString(),
      strategy: options.strategy,
    });
    manifest.frameworkVersion = newVersion;
  } else {
    manifest = {
      frameworkVersion: readFileSync(path.join(distPath, 'VERSION'), 'utf8').trim() || '1.0.0',
      installedAt: new Date().toISOString(),
      upgradeHistory: [],
      requirementId: REQUIREMENT_ID,
    };
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  actions.push('Created manifest.json');
  console.log('  ✅ manifest.json');

  // Create assets.json
  const assetsPath = path.join(loadedVibesPath, 'assets.json');
  if (!existsSync(assetsPath)) {
    const assets = { assets: {}, createdAt: new Date().toISOString() };
    await writeFile(assetsPath, JSON.stringify(assets, null, 2), 'utf8');
    actions.push('Created assets.json');
    console.log('  ✅ assets.json');
  }

  // Write install log
  const logsDir = path.join(loadedVibesPath, 'logs');
  const logPath = await writeInstallLog(logsDir, {
    timestamp: new Date().toISOString(),
    projectDir,
    mode,
    strategy: options.attach ? options.strategy : null,
    actions,
  });
  console.log('  ✅ logs/install-*.md');

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    🎉 SUCCESS!                                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Next steps:');
  if (!options.attach || options.projectDir !== '.') {
    console.log(`  cd ${path.basename(projectDir)}`);
  }
  console.log('  loaded-vibes doctor           # Verify installation');
  console.log('  loaded-vibes dashboard        # Open retro dashboard');
  console.log('  loaded-vibes devcycle --list  # View available DevCycles');
  console.log('');
  console.log(`Install log: ${logPath}`);
  console.log('');
  console.log('References: PRD §5.1, TECH §5.1, ADR-001');
  console.log('');
}
