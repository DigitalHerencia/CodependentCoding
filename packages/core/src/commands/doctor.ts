import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { NormalizedRecipe } from '@loaded-vibes/schema';
import { loadGeneratedProject } from '../project.js';

export type DiagnosticStatus = 'pass' | 'fail';
export type DiagnosticOwner = 'local' | 'user-setup' | 'generator';

export interface DiagnosticCheck {
  id: string;
  label: string;
  status: DiagnosticStatus;
  owner: DiagnosticOwner;
  message: string;
  action?: string;
}

export interface DoctorResult {
  directory: string;
  ok: boolean;
  checks: DiagnosticCheck[];
}

interface EnvRequirement {
  name: string;
  hint: string;
  valid?: (value: string) => boolean;
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function readEnvironment(
  directory: string,
): Promise<Map<string, string>> {
  const values = new Map<string, string>();
  for (const file of ['.env', '.env.local']) {
    try {
      const body = await readFile(path.join(directory, file), 'utf8');
      for (const line of body.split(/\r?\n/)) {
        const match = line.match(
          /^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/,
        );
        if (!match?.[1] || match[2] === undefined) continue;
        values.set(match[1], match[2].replace(/^['"]|['"]$/g, '').trim());
      }
    } catch {
      // Missing local environment files are reported as individual setup checks.
    }
  }
  return values;
}

function envRequirements(recipe: NormalizedRecipe): EnvRequirement[] {
  const requirements: EnvRequirement[] = [
    {
      name: 'DATABASE_URL',
      hint: 'Set the pooled Neon runtime URL in .env.local.',
      valid: (value) =>
        value.startsWith('postgresql://') && value.includes('-pooler'),
    },
    {
      name: 'DIRECT_DATABASE_URL',
      hint: 'Set the direct Neon migration URL in .env.local.',
      valid: (value) =>
        value.startsWith('postgresql://') && !value.includes('-pooler'),
    },
    {
      name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      hint: 'Add the Clerk publishable key to .env.local.',
      valid: (value) => value.startsWith('pk_'),
    },
    {
      name: 'CLERK_SECRET_KEY',
      hint: 'Add the Clerk secret key to .env.local.',
      valid: (value) => value.startsWith('sk_'),
    },
    {
      name: 'CLERK_WEBHOOK_SIGNING_SECRET',
      hint: 'Create the Clerk webhook and add its whsec_ secret to .env.local.',
      valid: (value) => value.startsWith('whsec_'),
    },
  ];
  if (recipe.modules.billing) {
    requirements.push(
      {
        name: 'STRIPE_SECRET_KEY',
        hint: 'Add the Stripe secret key to .env.local.',
        valid: (value) => value.startsWith('sk_'),
      },
      {
        name: 'STRIPE_WEBHOOK_SECRET',
        hint: 'Create the Stripe subscription webhook and add its whsec_ secret.',
        valid: (value) => value.startsWith('whsec_'),
      },
      {
        name: 'STRIPE_RECURRING_PRICE_ID',
        hint: 'Create a recurring Stripe Price and add its price_ ID.',
        valid: (value) => value.startsWith('price_'),
      },
    );
  }
  if (recipe.modules.stripeConnect) {
    requirements.push({
      name: 'STRIPE_CONNECT_WEBHOOK_SECRET',
      hint: 'Register the Connect webhook and add its whsec_ secret.',
      valid: (value) => value.startsWith('whsec_'),
    });
  }
  return requirements;
}

export async function diagnoseProject(directory = '.'): Promise<DoctorResult> {
  const target = path.resolve(directory);
  const checks: DiagnosticCheck[] = [];
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  checks.push(
    nodeMajor >= 24
      ? {
          id: 'node',
          label: 'Node.js',
          status: 'pass',
          owner: 'local',
          message: `Node ${process.versions.node}`,
        }
      : {
          id: 'node',
          label: 'Node.js',
          status: 'fail',
          owner: 'local',
          message: `Node ${process.versions.node} is unsupported.`,
          action: 'Install Node.js 24 and rerun loaded-vibes doctor.',
        },
  );

  let recipe: NormalizedRecipe | undefined;
  try {
    const project = await loadGeneratedProject(target);
    recipe = project.recipe;
    checks.push({
      id: 'recipe-manifest',
      label: 'Recipe and manifest',
      status: 'pass',
      owner: 'generator',
      message: `Schema v${project.manifest.schemaVersion}; ${project.manifest.modules.length} packaged modules.`,
    });
  } catch (error) {
    checks.push({
      id: 'recipe-manifest',
      label: 'Recipe and manifest',
      status: 'fail',
      owner: 'generator',
      message: error instanceof Error ? error.message : String(error),
      action: 'Run this command from an intact Loaded Vibes generated project.',
    });
  }

  const packageManagerReady =
    (await exists(path.join(target, 'package.json'))) &&
    (await exists(path.join(target, 'pnpm-lock.yaml')));
  checks.push(
    packageManagerReady
      ? {
          id: 'package-manager',
          label: 'Package manager',
          status: 'pass',
          owner: 'local',
          message: 'pnpm project metadata is present.',
        }
      : {
          id: 'package-manager',
          label: 'Package manager',
          status: 'fail',
          owner: 'generator',
          message: 'package.json or pnpm-lock.yaml is missing.',
          action: 'Restore the generated package files before continuing.',
        },
  );

  const dependenciesReady = await exists(path.join(target, 'node_modules'));
  checks.push(
    dependenciesReady
      ? {
          id: 'dependencies',
          label: 'Dependencies',
          status: 'pass',
          owner: 'local',
          message: 'node_modules is present.',
        }
      : {
          id: 'dependencies',
          label: 'Dependencies',
          status: 'fail',
          owner: 'local',
          message: 'Dependencies are not installed.',
          action: 'Run corepack pnpm install.',
        },
  );

  const prismaReady = await exists(
    path.join(target, 'prisma', 'generated', 'prisma', 'client.ts'),
  );
  checks.push(
    prismaReady
      ? {
          id: 'prisma-client',
          label: 'Prisma client',
          status: 'pass',
          owner: 'local',
          message: 'Generated Prisma client is present.',
        }
      : {
          id: 'prisma-client',
          label: 'Prisma client',
          status: 'fail',
          owner: 'local',
          message: 'Generated Prisma client is missing.',
          action: 'Run corepack pnpm db:generate.',
        },
  );

  if (recipe) {
    const environment = await readEnvironment(target);
    for (const requirement of envRequirements(recipe)) {
      const value = environment.get(requirement.name) ?? '';
      const valid = value.length > 0 && (requirement.valid?.(value) ?? true);
      checks.push(
        valid
          ? {
              id: `env:${requirement.name}`,
              label: requirement.name,
              status: 'pass',
              owner: 'user-setup',
              message: 'Configured with the expected shape.',
            }
          : {
              id: `env:${requirement.name}`,
              label: requirement.name,
              status: 'fail',
              owner: 'user-setup',
              message: value
                ? 'Configured value has an unexpected shape.'
                : 'Missing.',
              action: requirement.hint,
            },
      );
    }
  }

  return {
    directory: target,
    ok: checks.every((check) => check.status === 'pass'),
    checks,
  };
}
