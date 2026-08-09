import path from 'node:path';
import { Command } from 'commander';
import { cancel, intro, isCancel, outro, spinner, text } from '@clack/prompts';
import {
  applyProjectModuleAddition,
  createProject,
  diagnoseProject,
  explainProject,
  loadConfigFile,
  LoadedVibesError,
  planProjectModuleAddition,
  resolveRecipe,
  type ConfigInput,
  type RecipeInput,
} from '@loaded-vibes/core';
import {
  collectInteractiveRecipe,
  formatRecipeReview,
  reviewRecipe,
} from './create-flow.js';

const program = new Command();
program
  .name('loaded-vibes')
  .description('Generate a complete Loaded Vibes SaaS project.')
  .version('0.1.0');

interface CreateFlags {
  name?: string;
  yes?: boolean;
  config?: string;
  git: boolean;
  skipInstall?: boolean;
  dryRun?: boolean;
}

function configureCreateCommand(command: Command): Command {
  return command
    .argument('[target-directory]')
    .option('--name <package-name>')
    .option('--yes')
    .option('--config <path>')
    .option('--no-git')
    .option('--skip-install')
    .option('--dry-run');
}

async function runCreate(
  targetDirectory: string | undefined,
  flags: CreateFlags,
) {
  intro('Loaded Vibes');
  const fileInput = flags.config ? await loadConfigFile(flags.config) : {};
  let target = targetDirectory ?? fileInput.targetDirectory;
  if (!target && !flags.yes && process.stdin.isTTY) {
    const answer = await text({
      message: 'Where should the project be created?',
      placeholder: 'my-saas',
    });
    if (isCancel(answer)) {
      cancel('Creation cancelled.');
      process.exitCode = 1;
      return;
    }
    target = answer;
  }
  if (!target)
    throw new LoadedVibesError(
      'INVALID_CONFIG',
      'A target directory is required.',
    );

  const baseRecipe: RecipeInput = {
    ...(fileInput.schemaVersion === undefined &&
    fileInput.recipe?.schemaVersion === undefined
      ? {}
      : {
          schemaVersion:
            fileInput.schemaVersion ?? fileInput.recipe?.schemaVersion,
        }),
    name:
      flags.name ??
      fileInput.recipe?.name ??
      fileInput.name ??
      fileInput.projectName ??
      path.basename(path.resolve(target)).toLowerCase(),
    product:
      fileInput.recipe?.product ?? fileInput.product ?? 'bare-golden-app',
    modules: {
      ...fileInput.recipe?.modules,
      ...fileInput.modules,
    },
    identity: {
      ...fileInput.recipe?.identity,
      ...fileInput.identity,
    },
    design: {
      ...fileInput.recipe?.design,
      ...fileInput.design,
    },
  };
  let recipe = baseRecipe;
  const interactive = !flags.yes && !flags.config && process.stdin.isTTY;
  if (interactive) {
    const collected = await collectInteractiveRecipe(baseRecipe);
    if (!collected) {
      cancel('Creation cancelled.');
      process.exitCode = 1;
      return;
    }
    recipe = collected;
    if (!(await reviewRecipe(recipe))) {
      cancel('Creation cancelled before files were written.');
      process.exitCode = 1;
      return;
    }
  } else {
    console.log(`Build review\n\n${formatRecipeReview(resolveRecipe(recipe))}`);
  }

  const input: ConfigInput = {
    targetDirectory: target,
    recipe,
    git: { initialize: flags.git && (fileInput.git?.initialize ?? true) },
    install: {
      enabled: !flags.skipInstall && (fileInput.install?.enabled ?? true),
    },
  };
  const progress = spinner();
  if (!flags.dryRun) progress.start('Building your product foundation');
  let result;
  try {
    result = await createProject(input, {
      dryRun: Boolean(flags.dryRun),
    });
  } catch (error) {
    if (!flags.dryRun) progress.stop('Generation stopped');
    throw error;
  }
  if (!flags.dryRun) progress.stop('Product foundation generated');
  if (result.status === 'planned') {
    outro('Dry run complete; no files were written.');
  } else if (result.status === 'accepted') {
    outro(`Created and acceptance-validated ${recipe.name}.`);
  } else {
    outro(
      `Generated ${recipe.name}; install and acceptance validation were skipped.`,
    );
  }
}

function attachCreateAction(command: Command): void {
  command.action((targetDirectory: string | undefined, flags: CreateFlags) =>
    runCreate(targetDirectory, flags),
  );
}

attachCreateAction(
  configureCreateCommand(
    program
      .command('create')
      .description('Create a Loaded Vibes SaaS project.'),
  ),
);

program
  .command('add')
  .description('Add a supported Loaded Vibes capability module.')
  .argument('<module>', 'marketing, sample-domain, or stripe-connect')
  .option('--cwd <directory>', 'generated project directory', '.')
  .action(async (module: string, flags: { cwd: string }) => {
    intro('Loaded Vibes add');
    const plan = await planProjectModuleAddition(flags.cwd, module);
    console.log(
      [
        `Module: ${plan.module}`,
        `Capabilities: ${plan.addedCapabilities.join(', ')}`,
        `Prerequisites: ${plan.prerequisites.join(', ') || 'none'}`,
        `Files: ${plan.files.length} (${plan.replacements.length} intentional replacement${plan.replacements.length === 1 ? '' : 's'})`,
        `Setup: ${plan.setup.length ? plan.setup.join(' ') : 'none'}`,
      ].join('\n'),
    );
    const progress = spinner();
    progress.start(`Adding ${plan.module}`);
    let result;
    try {
      result = await applyProjectModuleAddition(plan);
    } catch (error) {
      progress.stop('Module addition stopped');
      throw error;
    }
    progress.stop(`Added ${result.module}`);
    outro(
      `${result.filesAdded.length} files added, ${result.filesReplaced.length} updated. ${result.setup.join(' ')}`.trim(),
    );
  });

program
  .command('doctor')
  .description('Diagnose generated-project readiness and configuration.')
  .option('--cwd <directory>', 'generated project directory', '.')
  .action(async (flags: { cwd: string }) => {
    intro('Loaded Vibes doctor');
    const result = await diagnoseProject(flags.cwd);
    for (const check of result.checks) {
      const mark = check.status === 'pass' ? '✓' : '✗';
      console.log(`${mark} ${check.label}: ${check.message}`);
      if (check.action) console.log(`  ${check.action}`);
    }
    if (result.ok) outro('Project prerequisites are ready.');
    else {
      outro('Complete the actions above, then rerun loaded-vibes doctor.');
      process.exitCode = 1;
    }
  });

program
  .command('explain')
  .description('Explain a generated project and its remaining setup.')
  .option('--cwd <directory>', 'generated project directory', '.')
  .action(async (flags: { cwd: string }) => {
    intro('Loaded Vibes explain');
    const explanation = await explainProject(flags.cwd);
    console.log(
      [
        explanation.product,
        '',
        `Preset: ${explanation.preset.label} (${explanation.preset.id})`,
        `Capabilities: ${explanation.capabilities.join(', ')}`,
        `Packaged modules: ${explanation.modules.join(', ') || 'none'}`,
        `Design: ${explanation.design.join(', ')}`,
        '',
        'Provider boundaries',
        ...explanation.providers.map((provider) => `  - ${provider}`),
        '',
        'Architecture',
        ...explanation.architecture.map((rule) => `  - ${rule}`),
        '',
        'Remaining setup',
        ...(explanation.remainingSetup.length
          ? explanation.remainingSetup.map((item) => `  - ${item}`)
          : ['  - none']),
      ].join('\n'),
    );
    outro('Explanation complete.');
  });

const explicitCommands = new Set(['create', 'add', 'doctor', 'explain']);
const firstArgument = process.argv[2];
if (
  firstArgument === undefined ||
  (!explicitCommands.has(firstArgument) &&
    !['--help', '-h', '--version', '-V'].includes(firstArgument))
) {
  process.argv.splice(2, 0, 'create');
}

program.parseAsync().catch((error: unknown) => {
  if (error instanceof LoadedVibesError)
    console.error(`${error.code}: ${error.message}`);
  else console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
