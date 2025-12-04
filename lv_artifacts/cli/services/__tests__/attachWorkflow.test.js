// @ts-nocheck
/**
 * Attach Workflow Test Stubs
 *
 * Covers retrofit/attach flow with Mirror / Merge / Sandbox strategies.
 * To be implemented once test harness (Vitest) is wired.
 *
 * @module dist/cli/services/__tests__/attachWorkflow.test
 * @see docs/PRD.md §5.1
 * @see docs/TECH_REQUIREMENTS.md §5.1
 */

const unitTestCases = {
  'detectExistingRepo()': [
    'detects .git indicator',
    'detects .loaded-vibes indicator',
    'returns repoDetected=false when no indicators present',
  ],
  'enumerateConflicts()': [
    'returns newFiles when destination missing',
    'detects conflicts when hashes differ',
    'ignores identical files',
  ],
  'applyMirror()': [
    'removes existing destination segment',
    'copies all focus segments',
  ],
  'applyMerge()': [
    'adds missing files',
    'prompts before overwriting conflicts',
    'respects autoApprove option',
  ],
  'applySandbox()': [
    'creates timestamped sandbox folder',
    'copies focus segments into sandbox',
  ],
  'writeInstallLog()': [
    'writes markdown log with requirement id',
    'appends when log file already exists',
  ],
};

const integrationTestCases = {
  'Mirror strategy end-to-end': [
    'overwrites existing .loaded-vibes assets',
    'logs approvals and actions',
  ],
  'Merge strategy end-to-end': [
    'preserves existing files unless approved',
    'logs kept vs overwritten decisions',
  ],
  'Sandbox strategy end-to-end': [
    'copies assets into sandbox without touching destination',
    'records sandbox path in log',
  ],
};

export { unitTestCases, integrationTestCases };

console.log('Attach workflow test stubs loaded for planning purposes.');
