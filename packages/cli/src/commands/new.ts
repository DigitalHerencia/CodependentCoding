import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

import * as p from "@clack/prompts";
import type { Command } from "commander";

import { parseHex } from "#cli/compose/brand";
import {
  composeApp,
  isValidAppName,
  readManifest,
  toAppName,
  type TemplateManifest,
} from "#cli/compose/composeApp";
import { resolveTemplate } from "#cli/manifest/template";

interface NewOptions {
  preset?: string;
  modules?: string;
  all?: boolean;
  color?: string;
  name?: string;
  yes?: boolean;
  install: boolean;
  git: boolean;
}

const CUSTOM = "__custom__";

function cancelled<T>(value: T): Exclude<T, symbol> {
  if (p.isCancel(value)) {
    p.cancel("Cancelled.");
    process.exit(1);
  }
  return value as Exclude<T, symbol>;
}

function fromFlags(
  manifest: TemplateManifest,
  options: NewOptions,
): string[] | null {
  if (options.all) return manifest.modules.map(({ id }) => id);
  if (options.modules) {
    return options.modules
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }
  if (options.preset) {
    const preset = manifest.presets[options.preset];
    if (!preset) {
      throw new Error(
        `Unknown preset "${options.preset}". Presets: ${Object.keys(manifest.presets).join(", ")}.`,
      );
    }
    return preset;
  }
  return null;
}

async function promptModules(manifest: TemplateManifest): Promise<string[]> {
  const preset = cancelled(
    await p.select({
      message: "Preset",
      options: [
        ...Object.entries(manifest.presets).map(([id, modules]) => ({
          value: id,
          label: id,
          hint: modules.length > 0 ? modules.join(", ") : "base only",
        })),
        { value: CUSTOM, label: "custom", hint: "pick modules" },
      ],
    }),
  );
  if (preset !== CUSTOM) return manifest.presets[preset] ?? [];
  return cancelled(
    await p.multiselect({
      message: "Modules (dependencies are added for you)",
      options: manifest.modules.map(({ id, kind }) => ({
        value: id,
        label: id,
        hint: kind,
      })),
      required: false,
    }),
  );
}

/** Runs a step command; a failure stops `new` with the command's exit code. */
function run(command: string, args: string[], cwd: string): void {
  const { status } = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    // pnpm and git are .cmd shims on some Windows installs.
    shell: process.platform === "win32",
  });
  if (status !== 0) {
    throw new Error(
      `\`${command} ${args.join(" ")}\` failed in ${cwd} (exit ${status}).`,
    );
  }
}

export function registerNew(program: Command, cliVersion: string): void {
  program
    .command("new")
    .description("Generate an app from the template")
    .argument("<dir>", "directory to create (must be empty or missing)")
    .option("--preset <id>", "module preset from hipster.modules.json")
    .option("--modules <ids>", "comma-separated modules (dependsOn added)")
    .option("--all", "every module")
    .option("--color <hex>", "brand color, e.g. #2f7a8d")
    .option("--name <name>", "package name (default: directory name)")
    .option(
      "-y, --yes",
      "no prompts; unanswered choices use defaults (blank preset)",
    )
    .option("--no-install", "skip pnpm install")
    .option("--no-git", "skip git init")
    .action(async (dir: string, options: NewOptions) => {
      const outDir = path.resolve(dir);
      const { dir: templateDir } = resolveTemplate();
      const manifest = readManifest(templateDir);
      const interactive = !options.yes && process.stdin.isTTY === true;

      if (interactive) p.intro("hipster-stack new");

      let name = options.name ?? toAppName(path.basename(outDir));
      if (interactive && !options.name) {
        name = cancelled(
          await p.text({
            message: "App name",
            initialValue: name,
            validate: (value) =>
              value && isValidAppName(value)
                ? undefined
                : "Use lowercase letters, digits, . _ ~ -",
          }),
        );
      }

      let modules = fromFlags(manifest, options);
      if (!modules) modules = interactive ? await promptModules(manifest) : [];

      let color: string | null = null;
      if (options.color) {
        color = parseHex(options.color);
        if (!color)
          throw new Error(
            `--color must be a 6-digit hex, got "${options.color}".`,
          );
      } else if (interactive) {
        const answer = cancelled(
          await p.text({
            message: "Brand color (blank keeps the template default)",
            placeholder: "#2f7a8d",
            validate: (value) =>
              !value || parseHex(value)
                ? undefined
                : "Use a 6-digit hex like #2f7a8d",
          }),
        );
        color = answer ? parseHex(answer) : null;
      }

      const result = await composeApp({
        templateDir,
        outDir,
        modules,
        name,
        color,
        cliVersion,
        now: new Date(),
      });
      p.log.success(
        `Composed base + [${result.modules.join(", ")}]: ${result.files} files, ${result.removed} module files left out.`,
      );
      if (result.removedPackages.length > 0) {
        p.log.info(`Pruned packages: ${result.removedPackages.join(", ")}`);
      }
      if (result.brand && result.brand.ratio < 4.5) {
        p.log.warn(
          `Brand color contrast is ${result.brand.ratio.toFixed(2)}:1 against --${result.brand.foreground}; WCAG AA wants 4.5:1 for text.`,
        );
      }

      // The template's own Prisma; cwd outside the app so its prisma.config.ts
      // (which needs the app's dependencies) is not loaded before install.
      run(
        process.execPath,
        [
          path.join(templateDir, "node_modules", "prisma", "build", "index.js"),
          "validate",
          "--schema",
          path.join(outDir, "prisma", "schema"),
        ],
        tmpdir(),
      );
      // Pruning changed package.json, so the copied lockfile must be updated.
      if (options.install)
        run("pnpm", ["install", "--no-frozen-lockfile"], outDir);
      if (options.git) run("git", ["init", "--quiet"], outDir);

      const relative = path.relative(process.cwd(), outDir);
      const next = [
        `cd ${relative && !relative.startsWith("..") ? relative : outDir}`,
        ...(options.install ? [] : ["pnpm install"]),
        process.platform === "win32"
          ? "Copy-Item .env.example .env.local  # then fill in values"
          : "cp .env.example .env.local  # then fill in values",
        "pnpm db:init",
        "pnpm dev",
      ];
      p.note(next.join("\n"), "Next steps");
      if (interactive) p.outro("Done.");
    });
}
