import path from 'node:path';
import { Command } from 'commander';
import { cancel, intro, isCancel, outro, text } from '@clack/prompts';
import {
  createProject,
  loadConfigFile,
  LoadedVibesError,
  type ConfigInput,
} from '@loaded-vibes/core';

const program = new Command();
program
  .name('create-loaded-vibes')
  .description('Generate a complete Loaded Vibes SaaS project.')
  .version('0.1.0')
  .argument('[target-directory]')
  .option('--name <package-name>')
  .option('--yes')
  .option('--config <path>')
  .option('--no-git')
  .option('--skip-install')
  .option('--dry-run')
  .action(async (targetDirectory: string | undefined, flags) => {
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

    const input: ConfigInput = {
      targetDirectory: target,
      name:
        flags.name ??
        fileInput.recipe?.name ??
        fileInput.name ??
        fileInput.projectName ??
        path.basename(path.resolve(target)).toLowerCase(),
      ...(fileInput.schemaVersion === undefined
        ? {}
        : { schemaVersion: fileInput.schemaVersion }),
      ...(fileInput.recipe?.product === undefined &&
      fileInput.product === undefined
        ? {}
        : { product: fileInput.recipe?.product ?? fileInput.product }),
      git: { initialize: flags.git && (fileInput.git?.initialize ?? true) },
      install: {
        enabled: !flags.skipInstall && (fileInput.install?.enabled ?? true),
      },
    };
    const result = await createProject(input, {
      dryRun: Boolean(flags.dryRun),
    });
    if (result.status === 'planned') {
      console.log(JSON.stringify(result.plan, null, 2));
      outro('Dry run complete; no files were written.');
    } else if (result.status === 'accepted') {
      outro(`Created and acceptance-validated ${input.name}.`);
    } else {
      outro(
        `Generated ${input.name}; install and acceptance validation were skipped.`,
      );
    }
  });

program.parseAsync().catch((error: unknown) => {
  if (error instanceof LoadedVibesError)
    console.error(`${error.code}: ${error.message}`);
  else console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
