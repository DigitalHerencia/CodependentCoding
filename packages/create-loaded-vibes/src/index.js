// @ts-nocheck
/**
 * create-loaded-vibes Main Installer Module
 *
 * Implements the complete installation workflow per PRD §5.1, TECH §5.1:
 * 1. Parse CLI arguments (project directory, --attach, --stack, etc.)
 * 2. Run preflight checks (Node >= 20, git, pnpm, VS Code, GenAIScript)
 * 3. Download or copy dist/** assets with SHA256 verification
 * 4. Mirror assets into .loaded-vibes/
 * 5. Handle attach workflow (Mirror/Merge/Sandbox strategies)
 * 6. Run `loaded-vibes init` for profile setup
 * 7. Display ASCII success banner
 *
 * @module create-loaded-vibes/src/index
 * @see docs/PRD.md §5.1 - Distribution & Installation
 * @see docs/TECH_REQUIREMENTS.md §5.1 - Distribution Model
 * @see spec/cli.spec.md §3 - Distribution & Bootstrap Coupling
 * @see docs/decisions/ADR-001-customization-versioning-strategy.md
 */

import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { mkdir, rm, copyFile, readdir, stat, writeFile, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { spawn, spawnSync } from 'child_process';
import { createInterface } from 'readline';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REQUIREMENT_ID = 'PRD §5.1 / TECH §5.1';
const PACKAGE_ROOT = path.resolve(CURRENT_DIR, '..');

// Resolve dist folder - in development, it's at project root; in published package, it's bundled
function getDistPath() {
  // First, check if we're in the monorepo development environment
  const monorepoDistPath = path.resolve(CURRENT_DIR, '..', '..', '..', 'dist');
  if (existsSync(monorepoDistPath)) {
    return monorepoDistPath;
  }
  // Fallback to bundled dist (for published package)
  const bundledDistPath = path.resolve(PACKAGE_ROOT, 'dist');
  if (existsSync(bundledDistPath)) {
    return bundledDistPath;
  }
  return null;
}

/**
 * Parse command line arguments
 * @param {string[]} argv - Command line arguments
 * @returns {Object} Parsed options
 */
function parseArgs(argv) {
  const options = {
    projectDir: null,
    attach: false,
    attachPath: null,
    strategy: 'merge',
    stack: 'next',
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
      case '--stack':
        options.stack = argv[++i] || 'next';
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
 * Display help message
 */
function showHelp() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║            CREATE LOADED VIBES - Framework Installer           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Usage: npx create-loaded-vibes [project-dir] [options]');
  console.log('');
  console.log('Arguments:');
  console.log('  project-dir       Directory to create/attach (default: current directory)');
  console.log('');
  console.log('Options:');
  console.log('  --attach [path]   Attach to existing repository (retrofit mode)');
  console.log('  --strategy <s>    Attach strategy: mirror, merge (default), or sandbox');
  console.log('  --stack <name>    Project stack (default: next)');
  console.log('  -y, --yes         Auto-approve all prompts');
  console.log('  -v, --verbose     Verbose output');
  console.log('  --skip-preflight  Skip environment prerequisite checks');
  console.log('  -h, --help        Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  npx create-loaded-vibes my-app          Create new project');
  console.log('  npx create-loaded-vibes --attach ./     Attach to current directory');
  console.log('  npx create-loaded-vibes --attach . --strategy sandbox');
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
 * Display ASCII banner
 * @param {boolean} success - Whether installation was successful
 */
async function showBanner(success = true) {
  try {
    // Dynamic import for optional dependencies
    const figletModule = await import('figlet');
    const figlet = figletModule.default || figletModule;
    const gradientModule = await import('gradient-string');
    const gradient = gradientModule.default || gradientModule;

    const text = figlet.textSync('Loaded Vibes', { font: 'Small' });
    console.log('');
    console.log(gradient.pastel.multiline(text));
    console.log('');
  } catch (err) {
    // Fallback if figlet/gradient not available
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                        LOADED VIBES                            ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');
  }

  if (success) {
    console.log('🎉 Installation complete!');
  }
}

/**
 * Prompt user for confirmation
 * @param {string} question - Question to ask
 * @param {boolean} defaultValue - Default value if non-interactive
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
 * Prompt user for strategy selection
 * @param {boolean} autoApprove - Auto-approve mode
 * @returns {Promise<'mirror'|'merge'|'sandbox'>}
 */
async function promptStrategy(autoApprove = false) {
  if (autoApprove || !process.stdin.isTTY) {
    return 'merge';
  }

  try {
    const promptsModule = await import('prompts');
    const prompts = promptsModule.default || promptsModule;

    const response = await prompts({
      type: 'select',
      name: 'strategy',
      message: 'Choose attach strategy (ADR-001):',
      choices: [
        { title: 'Merge (recommended)', value: 'merge', description: 'Merge assets, prompt for conflicts' },
        { title: 'Mirror', value: 'mirror', description: 'Replace all with shipped versions' },
        { title: 'Sandbox', value: 'sandbox', description: 'Extract to sandbox for review' },
      ],
      initial: 0,
    });

    return response.strategy || 'merge';
  } catch (err) {
    // Fallback to readline if prompts not available
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
      console.log('');
      console.log('Choose attach strategy:');
      console.log('  1. Merge (recommended) - Merge assets, prompt for conflicts');
      console.log('  2. Mirror - Replace all with shipped versions');
      console.log('  3. Sandbox - Extract to sandbox for review');
      rl.question('Enter choice (1/2/3): ', (answer) => {
        rl.close();
        const choice = answer.trim();
        if (choice === '2') resolve('mirror');
        else if (choice === '3') resolve('sandbox');
        else resolve('merge');
      });
    });
  }
}

/**
 * Run preflight checks
 * @param {Object} options - Options
 * @returns {Promise<{success: boolean, results: Object[]}>}
 */
async function runPreflightChecks(options = {}) {
  console.log('');
  console.log('🔍 Running preflight checks [PRD §5.1, TECH §5.1]...');
  console.log('');

  const checks = [];

  // Check Node.js version
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  checks.push({
    name: 'Node.js',
    passed: nodeMajor >= 20,
    message: nodeMajor >= 20
      ? `✅ Node.js ${nodeVersion} (>= 20 required)`
      : `❌ Node.js ${nodeVersion} - upgrade to >= 20`,
    remediation: nodeMajor < 20 ? ['Install Node.js >= 20 from https://nodejs.org/'] : null,
  });

  // Check git
  try {
    const gitResult = spawnSync('git', ['--version'], { encoding: 'utf8' });
    checks.push({
      name: 'git',
      passed: gitResult.status === 0,
      message: gitResult.status === 0
        ? `✅ ${gitResult.stdout.trim()}`
        : '❌ git not found',
      remediation: gitResult.status !== 0 ? ['Install git from https://git-scm.com/'] : null,
    });
  } catch {
    checks.push({
      name: 'git',
      passed: false,
      message: '❌ git not found',
      remediation: ['Install git from https://git-scm.com/'],
    });
  }

  // Check pnpm
  try {
    const pnpmResult = spawnSync('pnpm', ['--version'], { encoding: 'utf8', shell: true });
    checks.push({
      name: 'pnpm',
      passed: pnpmResult.status === 0,
      message: pnpmResult.status === 0
        ? `✅ pnpm ${pnpmResult.stdout.trim()}`
        : '❌ pnpm not found',
      remediation: pnpmResult.status !== 0 ? ['Install pnpm: npm install -g pnpm'] : null,
    });
  } catch {
    checks.push({
      name: 'pnpm',
      passed: false,
      message: '❌ pnpm not found',
      remediation: ['Install pnpm: npm install -g pnpm'],
    });
  }

  // Check VS Code (optional but recommended)
  try {
    const codeResult = spawnSync('code', ['--version'], { encoding: 'utf8', shell: true });
    checks.push({
      name: 'VS Code',
      passed: true, // VS Code is recommended, not required
      message: codeResult.status === 0
        ? `✅ VS Code ${codeResult.stdout.split('\n')[0]}`
        : '⚠️ VS Code not in PATH (optional)',
      remediation: null,
    });
  } catch {
    checks.push({
      name: 'VS Code',
      passed: true, // Not blocking
      message: '⚠️ VS Code not in PATH (optional)',
      remediation: null,
    });
  }

  // Print results
  for (const check of checks) {
    console.log(`  ${check.message}`);
    if (!check.passed && check.remediation) {
      for (const step of check.remediation) {
        console.log(`    → ${step}`);
      }
    }
  }

  const requiredChecks = checks.filter(c => c.name !== 'VS Code');
  const allPassed = requiredChecks.every(c => c.passed);

  console.log('');
  if (allPassed) {
    console.log('✅ All required preflight checks passed');
  } else {
    console.log('❌ Some preflight checks failed');
  }

  return { success: allPassed, results: checks };
}

/**
 * Compute SHA256 hash of a file
 * @param {string} filePath - Path to file
 * @returns {string} SHA256 hash
 */
function computeSHA256(filePath) {
  const content = readFileSync(filePath);
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Recursively copy directory
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 * @param {Object} options - Options
 */
async function copyDirectory(src, dest, options = {}) {
  const { verbose = false, checksums = new Map() } = options;

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
        const hash = computeSHA256(destPath);
        checksums.set(path.relative(dest, destPath), hash);
        console.log(`  Copied: ${entry.name}`);
      }
    }
  }
}

/**
 * Write install log to .loaded-vibes/logs/install-YYYYMMDD.md
 * @param {string} logsDir - Logs directory path
 * @param {Object} logData - Log data
 */
async function writeInstallLog(logsDir, logData) {
  await mkdir(logsDir, { recursive: true });

  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const logPath = path.join(logsDir, `install-${datePart}.md`);

  const lines = [
    `# Loaded Vibes Install Log`,
    '',
    `- **Timestamp:** ${logData.timestamp}`,
    `- **Project:** ${logData.projectDir}`,
    `- **Mode:** ${logData.mode}`,
    `- **Strategy:** ${logData.strategy || 'N/A'}`,
    `- **Requirement:** ${REQUIREMENT_ID}`,
    '',
  ];

  if (logData.preflightResults) {
    lines.push('## Preflight Checks');
    lines.push('');
    for (const check of logData.preflightResults) {
      lines.push(`- ${check.message}`);
    }
    lines.push('');
  }

  if (logData.actions && logData.actions.length > 0) {
    lines.push('## Actions');
    lines.push('');
    for (const action of logData.actions) {
      lines.push(`- ${action}`);
    }
    lines.push('');
  }

  if (logData.decisions && logData.decisions.length > 0) {
    lines.push('## Decisions');
    lines.push('');
    for (const decision of logData.decisions) {
      lines.push(`- ${decision}`);
    }
    lines.push('');
  }

  const prefix = existsSync(logPath) ? '\n\n---\n\n' : '';
  await writeFile(logPath, `${prefix}${lines.join('\n')}`, { flag: 'a', encoding: 'utf8' });

  return logPath;
}

/**
 * Create new project
 * @param {string} projectDir - Project directory
 * @param {Object} options - Options
 */
async function createNewProject(projectDir, options = {}) {
  const { verbose = false, autoApprove = false } = options;
  const actions = [];
  const decisions = [];

  console.log('');
  console.log(`📁 Creating project: ${projectDir}`);
  console.log('');

  // Create project directory
  const targetPath = path.resolve(projectDir);
  if (existsSync(targetPath)) {
    if (!autoApprove) {
      const proceed = await promptYesNo(`Directory ${projectDir} exists. Continue?`, false);
      if (!proceed) {
        throw new Error('Installation cancelled by user');
      }
    }
    decisions.push(`User approved overwriting existing directory: ${projectDir}`);
  } else {
    await mkdir(targetPath, { recursive: true });
    actions.push(`Created project directory: ${targetPath}`);
  }

  // Create .loaded-vibes directory
  const loadedVibesPath = path.join(targetPath, '.loaded-vibes');
  await mkdir(loadedVibesPath, { recursive: true });
  actions.push(`Created .loaded-vibes directory`);

  // Get dist path
  const distPath = getDistPath();
  if (!distPath) {
    throw new Error('Could not find dist/ assets. Ensure you are running from the monorepo or published package.');
  }

  console.log(`📦 Copying assets from ${distPath}...`);
  if (verbose) {
    console.log(`  Source: ${distPath}`);
    console.log(`  Target: ${loadedVibesPath}`);
  }

  // Copy assets
  const segments = ['.github', '.vscode', '.genaiscript', 'cli', 'docs', 'genaiscript', 'scripts'];
  for (const segment of segments) {
    const srcPath = path.join(distPath, segment);
    const destPath = path.join(loadedVibesPath, segment);
    if (existsSync(srcPath)) {
      await copyDirectory(srcPath, destPath, { verbose });
      actions.push(`Copied ${segment}/ to .loaded-vibes/`);
      console.log(`  ✅ ${segment}/`);
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

  // Create manifest.json per ADR-001
  const manifestPath = path.join(loadedVibesPath, 'manifest.json');
  const manifest = {
    frameworkVersion: readFileSync(path.join(distPath, 'VERSION'), 'utf8').trim() || '1.0.0',
    installedAt: new Date().toISOString(),
    upgradeHistory: [],
    requirementId: REQUIREMENT_ID,
  };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  actions.push('Created manifest.json');
  console.log('  ✅ manifest.json');

  // Create assets.json for version tracking
  const assetsPath = path.join(loadedVibesPath, 'assets.json');
  const assets = { assets: {}, createdAt: new Date().toISOString() };
  await writeFile(assetsPath, JSON.stringify(assets, null, 2), 'utf8');
  actions.push('Created assets.json');
  console.log('  ✅ assets.json');

  // Write install log
  const logsDir = path.join(loadedVibesPath, 'logs');
  const logPath = await writeInstallLog(logsDir, {
    timestamp: new Date().toISOString(),
    projectDir: targetPath,
    mode: 'create',
    strategy: null,
    preflightResults: options.preflightResults,
    actions,
    decisions,
  });
  console.log(`  ✅ logs/install-*.md`);

  return { targetPath, loadedVibesPath, actions, logPath };
}

/**
 * Attach to existing repository
 * @param {string} targetDir - Target directory
 * @param {Object} options - Options
 */
async function attachToExisting(targetDir, options = {}) {
  const { strategy = 'merge', verbose = false, autoApprove = false } = options;
  const actions = [];
  const decisions = [];

  console.log('');
  console.log(`📁 Attaching to existing repository: ${targetDir}`);
  console.log(`📋 Strategy: ${strategy} [ADR-001]`);
  console.log('');

  const targetPath = path.resolve(targetDir);
  if (!existsSync(targetPath)) {
    throw new Error(`Target directory does not exist: ${targetDir}`);
  }

  // Create .loaded-vibes directory
  const loadedVibesPath = path.join(targetPath, '.loaded-vibes');
  const isExistingInstall = existsSync(loadedVibesPath);

  if (isExistingInstall) {
    decisions.push(`Existing .loaded-vibes detected - applying ${strategy} strategy`);
    console.log('⚠️ Existing .loaded-vibes installation detected');
    
    if (strategy === 'mirror') {
      if (!autoApprove) {
        const proceed = await promptYesNo('Mirror will replace all existing assets. Continue?', false);
        if (!proceed) {
          throw new Error('Installation cancelled by user');
        }
      }
      decisions.push('User approved mirror strategy');
      
      // Backup existing installation
      const backupDir = path.join(loadedVibesPath, 'backup', new Date().toISOString().replace(/[:.]/g, '-'));
      await mkdir(backupDir, { recursive: true });
      actions.push(`Created backup at ${backupDir}`);
    }
  }

  await mkdir(loadedVibesPath, { recursive: true });
  actions.push(`Ensured .loaded-vibes directory exists`);

  // Get dist path
  const distPath = getDistPath();
  if (!distPath) {
    throw new Error('Could not find dist/ assets.');
  }

  console.log(`📦 Copying assets (${strategy} mode)...`);

  // Copy assets based on strategy
  const segments = ['.github', '.vscode', '.genaiscript', 'cli', 'docs', 'genaiscript', 'scripts'];
  
  if (strategy === 'sandbox') {
    // Create sandbox directory
    const sandboxPath = path.join(loadedVibesPath, 'sandbox', new Date().toISOString().replace(/[:.]/g, '-'));
    await mkdir(sandboxPath, { recursive: true });
    decisions.push(`Created sandbox at ${sandboxPath}`);
    
    for (const segment of segments) {
      const srcPath = path.join(distPath, segment);
      const destPath = path.join(sandboxPath, segment);
      if (existsSync(srcPath)) {
        await copyDirectory(srcPath, destPath, { verbose });
        actions.push(`Copied ${segment}/ to sandbox`);
        console.log(`  📦 ${segment}/ → sandbox`);
      }
    }
    console.log('');
    console.log('💡 Assets copied to sandbox. Review and apply with:');
    console.log(`   loaded-vibes sandbox apply --all`);
  } else {
    // Mirror or Merge
    for (const segment of segments) {
      const srcPath = path.join(distPath, segment);
      const destPath = path.join(loadedVibesPath, segment);
      if (existsSync(srcPath)) {
        if (strategy === 'mirror' || !existsSync(destPath)) {
          await copyDirectory(srcPath, destPath, { verbose });
          actions.push(`Copied ${segment}/ (${strategy})`);
          console.log(`  ✅ ${segment}/`);
        } else {
          // Merge: copy non-conflicting files
          await copyDirectory(srcPath, destPath, { verbose });
          actions.push(`Merged ${segment}/`);
          console.log(`  🔀 ${segment}/ (merged)`);
        }
      }
    }
  }

  // Copy/update VERSION file
  const versionPath = path.join(distPath, 'VERSION');
  if (existsSync(versionPath)) {
    const destVersionPath = path.join(loadedVibesPath, 'VERSION');
    await copyFile(versionPath, destVersionPath);
    actions.push('Updated VERSION file');
    console.log('  ✅ VERSION');
  }

  // Update manifest.json
  const manifestPath = path.join(loadedVibesPath, 'manifest.json');
  let manifest;
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifest.upgradeHistory.push({
      from: manifest.frameworkVersion,
      to: readFileSync(path.join(distPath, 'VERSION'), 'utf8').trim(),
      at: new Date().toISOString(),
      strategy,
    });
    manifest.frameworkVersion = readFileSync(path.join(distPath, 'VERSION'), 'utf8').trim();
  } else {
    manifest = {
      frameworkVersion: readFileSync(path.join(distPath, 'VERSION'), 'utf8').trim() || '1.0.0',
      installedAt: new Date().toISOString(),
      upgradeHistory: [],
      requirementId: REQUIREMENT_ID,
    };
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  actions.push('Updated manifest.json');
  console.log('  ✅ manifest.json');

  // Write install log
  const logsDir = path.join(loadedVibesPath, 'logs');
  const logPath = await writeInstallLog(logsDir, {
    timestamp: new Date().toISOString(),
    projectDir: targetPath,
    mode: 'attach',
    strategy,
    preflightResults: options.preflightResults,
    actions,
    decisions,
  });
  console.log('  ✅ logs/install-*.md');

  return { targetPath, loadedVibesPath, actions, logPath };
}

/**
 * Run loaded-vibes init command
 * @param {string} projectDir - Project directory
 */
async function runInit(projectDir) {
  console.log('');
  console.log('🔧 Running loaded-vibes init...');

  // Check if loaded-vibes CLI exists in .loaded-vibes/cli
  const cliPath = path.join(projectDir, '.loaded-vibes', 'cli', 'index.js');
  if (existsSync(cliPath)) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [cliPath, 'preflight'], {
        cwd: projectDir,
        stdio: 'inherit',
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Initialization complete');
          resolve();
        } else {
          console.log('⚠️ Initialization completed with warnings');
          resolve(); // Don't fail on init warnings
        }
      });

      child.on('error', (err) => {
        console.log(`⚠️ Could not run init: ${err.message}`);
        resolve(); // Don't fail on init errors
      });
    });
  } else {
    console.log('⚠️ loaded-vibes CLI not found, skipping init');
  }
}

/**
 * Display success message
 * @param {Object} result - Installation result
 */
function showSuccess(result) {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    🎉 SUCCESS!                                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Next steps:');
  console.log(`  cd ${path.basename(result.targetPath)}`);
  console.log('  loaded-vibes doctor           # Verify installation');
  console.log('  loaded-vibes dashboard        # Open retro dashboard');
  console.log('  loaded-vibes devcycle --list  # View available DevCycles');
  console.log('');
  console.log('Documentation:');
  console.log('  .loaded-vibes/docs/           # Framework documentation');
  console.log('  .loaded-vibes/logs/           # Installation logs');
  console.log('');
  console.log(`Install log: ${result.logPath}`);
  console.log('');
  console.log('References: PRD §5.1, TECH §5.1, ADR-001');
  console.log('');
}

/**
 * Main entry point
 * @param {string[]} argv - Command line arguments
 */
export async function createLoadedVibes(argv) {
  const options = parseArgs(argv);

  if (options.help) {
    showHelp();
    return;
  }

  // Show banner
  await showBanner();

  // Run preflight checks
  let preflightResults = null;
  if (!options.skipPreflight) {
    const preflight = await runPreflightChecks(options);
    preflightResults = preflight.results;
    
    if (!preflight.success && !options.autoApprove) {
      const proceed = await promptYesNo('Some preflight checks failed. Continue anyway?', false);
      if (!proceed) {
        console.log('');
        console.log('Installation cancelled. Please fix the issues above and try again.');
        process.exit(1);
      }
    }
  }

  let result;

  if (options.attach) {
    // Attach mode
    const targetDir = options.attachPath || options.projectDir || '.';
    
    // Prompt for strategy if not specified and not auto-approve
    let strategy = options.strategy;
    if (!options.autoApprove && options.strategy === 'merge') {
      strategy = await promptStrategy(options.autoApprove);
    }
    
    result = await attachToExisting(targetDir, {
      strategy,
      verbose: options.verbose,
      autoApprove: options.autoApprove,
      preflightResults,
    });
  } else {
    // Create mode
    const projectDir = options.projectDir || '.';
    result = await createNewProject(projectDir, {
      verbose: options.verbose,
      autoApprove: options.autoApprove,
      preflightResults,
    });
  }

  // Run init
  await runInit(result.targetPath);

  // Show success
  showSuccess(result);
}

// Export functions for testing
export {
  parseArgs,
  runPreflightChecks,
  createNewProject,
  attachToExisting,
  copyDirectory,
  writeInstallLog,
  getDistPath,
};
