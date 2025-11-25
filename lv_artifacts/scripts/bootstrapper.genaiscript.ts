// @ts-nocheck

import path from 'path';
import { access, copyFile } from 'fs/promises';
import { loadManifest, resolveFromGenai, ARTIFACTS_ROOT } from '../genaiscript/shared/context.js';

script({
  title: 'Loaded Vibes Bootstrapper',
  description:
    'Validates DevCycle manifest, tool wiring, and VS Code profile before running the orchestrator.',
  parameters: {
    phase: {
      type: 'string',
      description: 'Optional DevCycle key to validate specifically.',
    },
    profilePath: {
      type: 'string',
      description:
        'Path to the VS Code profile that should mirror lv_artifacts/.vscode/profile.jsonc',
    },
    preflightOnly: {
      type: 'boolean',
      description: 'Run validations without emitting user guidance messages.',
      default: false,
    },
    fixProfile: {
      type: 'boolean',
      description: 'Create/update the profile file if it is missing.',
      default: false,
    },
  },
  tools: ['filesystem/*', 'sequentialthinking/*'],
});

async function fileExists(candidate) {
  try {
    await access(candidate);
    return true;
  } catch (error) {
    return false;
  }
}

async function ensureProfile(targetPath) {
  const resolvedTarget = path.resolve(targetPath);
  if (await fileExists(resolvedTarget)) {
    return { created: false, path: resolvedTarget, exists: true };
  }

  const templatePath = path.resolve(ARTIFACTS_ROOT, '.vscode', 'profile.jsonc');
  if (!(await fileExists(templatePath))) {
    throw new Error('Profile template missing at lv_artifacts/.vscode/profile.jsonc');
  }

  await copyFile(templatePath, resolvedTarget);
  return { created: true, path: resolvedTarget, exists: true };
}

const manifest = await loadManifest();
const requestedPhase = env.vars.phase ? env.vars.phase.toLowerCase() : null;
const phaseEntries = requestedPhase ? { [requestedPhase]: manifest[requestedPhase] } : manifest;

if (requestedPhase && !manifest[requestedPhase]) {
  throw new Error(
    `Phase '${requestedPhase}' not found. Allowed values: ${Object.keys(manifest).join(', ')}`
  );
}

const validationResults = [];
for (const [phaseKey, entry] of Object.entries(phaseEntries)) {
  const missingArtifacts = [];
  for (const artifactKey of ['instructions', 'toolset', 'prompt']) {
    const relativePath = entry[artifactKey];
    const absolutePath = resolveFromGenai(relativePath);
    if (!(await fileExists(absolutePath))) {
      missingArtifacts.push({ artifactKey, relativePath, absolutePath });
    }
  }
  validationResults.push({ phase: phaseKey, missingArtifacts });
}

const hasBlockingIssues = validationResults.some((item) => item.missingArtifacts.length > 0);

const defaultProfilePath = path.resolve(ARTIFACTS_ROOT, '.vscode', 'profile.jsonc');
const profilePath = path.resolve(env.vars.profilePath || defaultProfilePath);
const profileStatus =
  env.vars.fixProfile === 'true'
    ? await ensureProfile(profilePath)
    : {
        created: false,
        path: profilePath,
        exists: await fileExists(profilePath),
      };

const report = {
  validatedPhases: validationResults.length,
  missingArtifacts: validationResults.filter((item) => item.missingArtifacts.length > 0),
  profile: profileStatus,
};

if (!env.vars.preflightOnly) {
  console.log('🧭 Bootstrap Report:');
  console.log(report);
}

if (hasBlockingIssues) {
  throw new Error(
    `Bootstrap validation failed. Missing artifacts detected: ${JSON.stringify(
      report.missingArtifacts,
      null,
      2
    )}`
  );
}

console.log(
  `Bootstrap validation succeeded for ${validationResults.length} phase(s). Profile located at ${profileStatus.path}.`
);
