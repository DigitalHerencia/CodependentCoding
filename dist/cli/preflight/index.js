/**
 * Loaded Vibes Preflight Checks Module
 *
 * Verifies environment prerequisites before installation or DevCycle execution.
 * Provides actionable remediation guidance per PRD §5.1 and TECH §5.1.
 *
 * @module dist/cli/preflight
 * @see docs/PRD.md §5.1 - Distribution & Installation requirements
 * @see docs/TECH_REQUIREMENTS.md §5.1 - Distribution Model preflight checks
 * @see spec/cli.spec.md §3 - Distribution & Bootstrap Coupling
 */

import { execSync, spawn } from 'child_process';
import { access, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const TIMEOUT_MS = 10000;

/**
 * @typedef {Object} CheckResult
 * @property {string} name - Name of the check
 * @property {boolean} passed - Whether the check passed
 * @property {string} message - Descriptive message about the result
 * @property {string} [version] - Detected version (if applicable)
 * @property {string[]} [remediation] - Remediation steps if check failed
 */

/**
 * @typedef {Object} PreflightResult
 * @property {boolean} success - Whether all checks passed
 * @property {CheckResult[]} checks - Individual check results
 * @property {number} passedCount - Number of passed checks
 * @property {number} failedCount - Number of failed checks
 */

/**
 * Executes a command with timeout and returns stdout.
 * Note: Uses shell: true for cross-platform compatibility.
 * Commands and arguments should be hardcoded or validated before use.
 * @param {string} command - Command to execute (must be a known safe command)
 * @param {string[]} args - Command arguments (must be validated)
 * @param {number} [timeout=TIMEOUT_MS] - Timeout in milliseconds
 * @returns {Promise<string>} Command output
 */
function execCommand(command, args = [], timeout = TIMEOUT_MS) {
  // Allowlist of safe commands for preflight checks
  const allowedCommands = ['git', 'pnpm', 'code'];
  if (!allowedCommands.includes(command)) {
    return Promise.reject(new Error(`Command '${command}' is not in the allowed list`));
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: true,
      timeout,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim() || `Command failed with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Synchronously executes a command and returns stdout.
 * @param {string} command - Command to execute
 * @returns {string|null} Command output or null if failed
 */
function execCommandSync(command) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Parses a semantic version string.
 * @param {string} versionString - Version string (e.g., "v20.19.5" or "20.19.5")
 * @returns {{major: number, minor: number, patch: number}} Parsed version
 */
function parseVersion(versionString) {
  const match = versionString.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return { major: 0, minor: 0, patch: 0 };
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Checks if Node.js version is >= 20.
 * @returns {Promise<CheckResult>}
 */
async function checkNode() {
  const name = 'Node.js';
  const requiredMajor = 20;

  try {
    const version = process.version;
    const parsed = parseVersion(version);

    if (parsed.major >= requiredMajor) {
      return {
        name,
        passed: true,
        message: `Node.js ${version} detected (>= ${requiredMajor} required)`,
        version,
      };
    }

    return {
      name,
      passed: false,
      message: `Node.js ${version} detected, but >= ${requiredMajor} is required`,
      version,
      remediation: [
        `Install Node.js >= ${requiredMajor} from https://nodejs.org/`,
        'Or use nvm: nvm install 20 && nvm use 20',
        'Or use fnm: fnm install 20 && fnm use 20',
        '[PRD §5.1] Preflight checks require Node >= 20 for framework compatibility.',
      ],
    };
  } catch (error) {
    return {
      name,
      passed: false,
      message: `Failed to detect Node.js version: ${error.message}`,
      remediation: [
        `Install Node.js >= ${requiredMajor} from https://nodejs.org/`,
        '[PRD §5.1] Node.js is required to run Loaded Vibes.',
      ],
    };
  }
}

/**
 * Checks if Git is available.
 * @returns {Promise<CheckResult>}
 */
async function checkGit() {
  const name = 'Git';

  try {
    const output = await execCommand('git', ['--version']);
    const match = output.match(/git version ([\d.]+)/);
    const version = match ? match[1] : output;

    return {
      name,
      passed: true,
      message: `Git ${version} detected`,
      version,
    };
  } catch (error) {
    return {
      name,
      passed: false,
      message: 'Git not found or not accessible',
      remediation: [
        'Install Git from https://git-scm.com/downloads',
        'Windows: Use Git for Windows installer',
        'macOS: brew install git',
        'Linux (Debian/Ubuntu): sudo apt install git',
        'Linux (Fedora): sudo dnf install git',
        '[PRD §5.1] Git is required for version control and DevCycle operations.',
      ],
    };
  }
}

/**
 * Checks if pnpm is available.
 * @returns {Promise<CheckResult>}
 */
async function checkPnpm() {
  const name = 'pnpm';

  try {
    const output = await execCommand('pnpm', ['--version']);
    const version = output.trim();

    return {
      name,
      passed: true,
      message: `pnpm ${version} detected`,
      version,
    };
  } catch (error) {
    return {
      name,
      passed: false,
      message: 'pnpm not found or not accessible',
      remediation: [
        'Install pnpm: npm install -g pnpm',
        'Or use corepack: corepack enable && corepack prepare pnpm@latest --activate',
        'Or standalone: curl -fsSL https://get.pnpm.io/install.sh | sh -',
        '[PRD §5.1] pnpm is the recommended package manager for Loaded Vibes projects.',
      ],
    };
  }
}

/**
 * Checks if VS Code is available.
 * @returns {Promise<CheckResult>}
 */
async function checkVSCode() {
  const name = 'VS Code';

  try {
    const output = await execCommand('code', ['--version']);
    const lines = output.split('\n');
    const version = lines[0] || output.trim();

    return {
      name,
      passed: true,
      message: `VS Code ${version} detected`,
      version,
    };
  } catch (error) {
    // Fallback: check common installation paths
    const commonPaths = [];

    if (process.platform === 'win32') {
      // Windows: check common installation paths, filtering out undefined env vars
      if (process.env.LOCALAPPDATA) {
        commonPaths.push(
          path.join(process.env.LOCALAPPDATA, 'Programs', 'Microsoft VS Code', 'Code.exe')
        );
      }
      if (process.env.PROGRAMFILES) {
        commonPaths.push(
          path.join(process.env.PROGRAMFILES, 'Microsoft VS Code', 'Code.exe')
        );
      }
    } else if (process.platform === 'darwin') {
      commonPaths.push('/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code');
    } else {
      // Linux
      commonPaths.push('/usr/bin/code', '/usr/share/code/bin/code', '/snap/bin/code');
    }

    for (const codePath of commonPaths) {
      try {
        await access(codePath);
        return {
          name,
          passed: true,
          message: `VS Code found at ${codePath} (CLI not in PATH)`,
          remediation: [
            'Add VS Code to PATH for better CLI integration:',
            '  - Open VS Code',
            '  - Press Cmd/Ctrl+Shift+P',
            '  - Run "Shell Command: Install \'code\' command in PATH"',
          ],
        };
      } catch {
        // Path not found, continue checking
      }
    }

    return {
      name,
      passed: false,
      message: 'VS Code not found',
      remediation: [
        'Install VS Code from https://code.visualstudio.com/',
        'After installation, ensure the "code" command is in PATH:',
        '  - Open VS Code',
        '  - Press Cmd/Ctrl+Shift+P',
        '  - Run "Shell Command: Install \'code\' command in PATH"',
        '[PRD §5.1] VS Code is recommended for Loaded Vibes development workflow.',
      ],
    };
  }
}

/**
 * Checks if GenAIScript extension is available.
 * @returns {Promise<CheckResult>}
 */
async function checkGenAIScriptExtension() {
  const name = 'GenAIScript Extension';
  const extensionId = 'genaiscript.genaiscript-vscode';

  // Method 1: Try to list VS Code extensions
  try {
    const output = await execCommand('code', ['--list-extensions']);
    const extensions = output.toLowerCase().split('\n');

    if (extensions.some((ext) => ext.includes('genaiscript'))) {
      return {
        name,
        passed: true,
        message: 'GenAIScript extension is installed',
        version: 'installed',
      };
    }
  } catch {
    // VS Code CLI not available, try alternative methods
  }

  // Method 2: Check .vscode/extensions.json for recommendation
  try {
    const extensionsJsonPath = path.resolve(CURRENT_DIR, '..', '..', '.vscode', 'extensions.json');
    const content = await readFile(extensionsJsonPath, 'utf8');
    const config = JSON.parse(content);

    if (config.recommendations && config.recommendations.includes(extensionId)) {
      return {
        name,
        passed: true,
        message:
          'GenAIScript extension is recommended in extensions.json (install may be pending)',
        remediation: [
          'Open VS Code in this workspace to be prompted for installation',
          `Or install manually: code --install-extension ${extensionId}`,
        ],
      };
    }
  } catch {
    // extensions.json not found or invalid
  }

  // Method 3: Manual confirmation allowed
  return {
    name,
    passed: false,
    message: 'GenAIScript extension status could not be verified',
    remediation: [
      `Install the GenAIScript extension: code --install-extension ${extensionId}`,
      'Or install from VS Code Marketplace: search for "GenAIScript"',
      'Verify installation: code --list-extensions | grep genaiscript',
      '[PRD §5.1] GenAIScript extension enables AI-powered DevCycle automation.',
    ],
  };
}

/**
 * Runs all preflight checks.
 * @returns {Promise<PreflightResult>}
 */
async function runPreflightChecks() {
  const checks = await Promise.all([
    checkNode(),
    checkGit(),
    checkPnpm(),
    checkVSCode(),
    checkGenAIScriptExtension(),
  ]);

  const passedCount = checks.filter((c) => c.passed).length;
  const failedCount = checks.length - passedCount;

  return {
    success: failedCount === 0,
    checks,
    passedCount,
    failedCount,
  };
}

/**
 * Formats preflight results for console output.
 * @param {PreflightResult} result - Preflight check results
 * @returns {string} Formatted output
 */
function formatResults(result) {
  const lines = [];

  lines.push('');
  lines.push('╔══════════════════════════════════════════════════════════════╗');
  lines.push('║              LOADED VIBES PREFLIGHT CHECKS                   ║');
  lines.push('╚══════════════════════════════════════════════════════════════╝');
  lines.push('');

  for (const check of result.checks) {
    const icon = check.passed ? '✅' : '❌';
    lines.push(`${icon} ${check.name}: ${check.message}`);

    if (!check.passed && check.remediation) {
      lines.push('   Remediation steps:');
      for (const step of check.remediation) {
        lines.push(`     • ${step}`);
      }
      lines.push('');
    }
  }

  lines.push('');
  lines.push('──────────────────────────────────────────────────────────────────');
  lines.push(`Summary: ${result.passedCount}/${result.checks.length} checks passed`);

  if (result.success) {
    lines.push('');
    lines.push('🎉 All preflight checks passed! Ready to proceed.');
  } else {
    lines.push('');
    lines.push('⚠️  Some checks failed. Please address the issues above.');
    lines.push('   Reference: docs/PRD.md §5.1 for installation requirements.');
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Main entry point for CLI execution.
 * Runs preflight checks and outputs results.
 * @returns {Promise<void>}
 */
async function main() {
  const result = await runPreflightChecks();
  console.log(formatResults(result));
  process.exit(result.success ? 0 : 1);
}

// Export API for doctor command reuse
export {
  runPreflightChecks,
  formatResults,
  checkNode,
  checkGit,
  checkPnpm,
  checkVSCode,
  checkGenAIScriptExtension,
};

/**
 * Checks if this module is being run directly (not imported).
 * Handles cross-platform path differences.
 * @returns {boolean}
 */
function isRunningDirectly() {
  if (!process.argv[1]) {
    return false;
  }

  // Normalize paths for cross-platform comparison
  const scriptPath = fileURLToPath(import.meta.url);
  const invokePath = path.resolve(process.argv[1]);

  // Check exact match or if script is being run via node
  return (
    scriptPath === invokePath ||
    path.basename(invokePath) === 'index.js' &&
    path.basename(path.dirname(invokePath)) === 'preflight'
  );
}

// Run main if executed directly
if (isRunningDirectly()) {
  main().catch((error) => {
    console.error('Preflight check failed:', error.message);
    process.exit(1);
  });
}
