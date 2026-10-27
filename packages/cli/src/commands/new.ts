import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import * as p from "@clack/prompts";
import type { Command } from "commander";

import {
  type AccessChoices,
  accessControls,
  defaultAccess,
  parseChoice,
  tenancies,
} from "#cli/compose/access";
import { parseHex } from "#cli/compose/brand";
import {
  composeApp,
  isValidAppName,
  readManifest,
  toAppName,
  type TemplateManifest,
} from "#cli/compose/composeApp";
import { resolveTemplate } from "#cli/manifest/template";
import { connectDatabase } from "#cli/setup/connectDatabase";
import { isPostgresUrl, templateSqlRunner } from "#cli/setup/database";
import { spawnExec } from "#cli/setup/exec";
import { setupApp } from "#cli/setup/postCompose";
import { provision, type StepId } from "#cli/setup/provision";
import { writeEnvFile, writeEnvLocal } from "#cli/setup/envFile";
import { showBanner } from "#cli/wizard/banner";
import { type ClerkKeys, envPlan, integrationVars } from "#cli/wizard/keys";
import {
  cancelled,
  confirmSummary,
  promptClerk,
  promptIntegrations,
} from "#cli/wizard/prompts";

interface NewOptions {
  preset?: string;
  modules?: string;
  all?: boolean;
  color?: string;
  name?: string;
  tenancy?: string;
  access?: string;
  yes?: boolean;
  databaseUrl?: string;
  install: boolean;
  git: boolean;
  provision?: boolean;
  github: boolean;
  neon: boolean;
  vercel: boolean;
}

const STEP_PROMPT: Record<StepId, string> = {
  github: "Create a private GitHub repo and push (gh)?",
  neon: "Create a Neon project with owner and app_user roles (neonctl)?",
  vercel: "Link a Vercel project and set its database env vars (vercel)?",
};

const CUSTOM = "__custom__";

/** --tenancy / --access, prompting for whichever is missing when interactive. */
export async function accessChoices(
  options: Pick<NewOptions, "tenancy" | "access">,
  interactive: boolean,
): Promise<AccessChoices> {
  const flaggedTenancy =
    options.tenancy === undefined
      ? undefined
      : parseChoice("--tenancy", options.tenancy, tenancies);
  const flaggedAccess =
    options.access === undefined
      ? undefined
      : parseChoice("--access", options.access, accessControls);
  if (!interactive) {
    return {
      tenancy: flaggedTenancy ?? defaultAccess.tenancy,
      accessControl: flaggedAccess ?? defaultAccess.accessControl,
    };
  }
  const tenancy =
    flaggedTenancy ??
    cancelled(
      await p.select({
        message: "Organizations",
        initialValue: defaultAccess.tenancy,
        options: [
          {
            value: "multi" as const,
            label: "Multi-tenant",
            hint: "every sign-up gets its own organization; invite others in",
          },
          {
            value: "single" as const,
            label: "Single organization",
            hint: "the first sign-up owns it; everyone else joins by invitation",
          },
        ],
      }),
    );
  const accessControl =
    flaggedAccess ??
    cancelled(
      await p.select({
        message: "Authorization",
        initialValue: defaultAccess.accessControl,
        options: [
          {
            value: "abac" as const,
            label: "RBAC + ABAC",
            hint: "role permissions, then record rules (owner, assignee, shared with clients)",
          },
          {
            value: "rbac" as const,
            label: "RBAC only",
            hint: "role permissions decide; any record in the organization",
          },
        ],
      }),
    );
  return { tenancy, accessControl };
}

/** Modules from --all / --modules / --preset; null when none was given. */
export function fromFlags(
  manifest: TemplateManifest,
  options: Pick<NewOptions, "all" | "modules" | "preset">,
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

async function promptModules(
  manifest: TemplateManifest,
): Promise<{ domain: string; modules: string[] }> {
  const preset = cancelled(
    await p.select({
      message: "Domain",
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
  if (preset !== CUSTOM)
    return { domain: preset, modules: manifest.presets[preset] ?? [] };
  const modules = cancelled(
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
  return { domain: "custom", modules };
}

/** Returns whether .env.local now holds the database URLs. */
async function provisionApp(
  appDir: string,
  name: string,
  committed: boolean,
  templateDir: string,
  options: NewOptions,
  interactive: boolean,
): Promise<boolean> {
  const outcomes = await provision({
    appDir,
    name,
    git: committed,
    exec: spawnExec,
    runSql: templateSqlRunner(templateDir),
    log: {
      info: (message) => p.log.info(message),
      warn: (message) => p.log.warn(message),
    },
    enabled: {
      github: options.github,
      neon: options.neon,
      vercel: options.vercel,
    },
    confirm: interactive
      ? async (step) =>
          cancelled(
            await p.confirm({ message: STEP_PROMPT[step], initialValue: true }),
          )
      : undefined,
  });
  if (outcomes.some(({ status }) => status === "failed")) process.exitCode = 1;
  return outcomes.some(
    ({ step, status }) =>
      step === "neon" && (status === "done" || status === "exists"),
  );
}

function printNextSteps(
  appDir: string,
  installed: boolean,
  database: boolean,
  migrated = false,
  ngrokDomain?: string,
): void {
  const relative = path.relative(process.cwd(), appDir);
  const next = [
    `cd ${relative && !relative.startsWith("..") ? relative : appDir}`,
    ...(installed ? [] : ["pnpm install"]),
    database
      ? "# .env.local has the database URLs; add the remaining keys"
      : process.platform === "win32"
        ? "Copy-Item .env.example .env.local  # then fill in values"
        : "cp .env.example .env.local  # then fill in values",
    ...(migrated ? [] : ["pnpm db:init  # then commit prisma/migrations"]),
    "pnpm dev",
    ...(ngrokDomain
      ? [
          `ngrok http --url=${ngrokDomain} 3000  # second terminal`,
          `# Clerk dev webhook endpoint: https://${ngrokDomain}/api/clerk/webhooks`,
        ]
      : []),
  ];
  p.note(next.join("\n"), "Next steps");
}

export function registerNew(program: Command, cliVersion: string): void {
  program
    .command("new")
    .description("Generate an app from the template")
    .argument("[dir]", "directory to create (must be empty or missing)")
    .option("--preset <id>", "module preset from hipster.modules.json")
    .option("--modules <ids>", "comma-separated modules (dependsOn added)")
    .option("--all", "every module")
    .option("--color <hex>", "brand color, e.g. #2f7a8d")
    .option("--name <name>", "package name (default: directory name)")
    .option("--tenancy <mode>", "multi (default) or single organization")
    .option("--access <model>", "abac (RBAC + ABAC, default) or rbac")
    .option(
      "-y, --yes",
      "no prompts; unanswered choices use defaults (blank preset)",
    )
    .option(
      "--database-url <url>",
      "Neon connection string (pooled or direct) to wire into .env.local",
    )
    .option("--no-install", "skip pnpm install")
    .option("--no-git", "skip git init and the initial commit")
    .option(
      "--provision",
      "create the GitHub repo, Neon project and Vercel project (network)",
    )
    .option("--no-github", "with --provision: skip the GitHub repo")
    .option("--no-neon", "with --provision: skip the Neon project")
    .option("--no-vercel", "with --provision: skip the Vercel project")
    .action(async (dirArg: string | undefined, options: NewOptions) => {
      const { dir: templateDir } = resolveTemplate();
      const manifest = readManifest(templateDir);
      const interactive = !options.yes && process.stdin.isTTY === true;

      if (interactive) {
        await showBanner("retro-modern apps from the Maximal Template");
        p.intro("hipster-stack new");
      }
      const dir =
        dirArg ??
        (interactive
          ? cancelled(
              await p.text({
                message: "Project folder (new or empty)",
                placeholder: `.${path.sep}my-app`,
                validate: (value) =>
                  !value
                    ? "Type a folder path"
                    : existsSync(value) && readdirSync(value).length > 0
                      ? "That folder is not empty"
                      : undefined,
              }),
            )
          : null);
      if (!dir)
        throw new Error("new needs a directory: hipster-stack new <dir>");
      const outDir = path.resolve(dir);

      // Re-running on an app `new` already generated only provisions: the
      // steps skip what exists, so a missing CLI or login can be fixed later.
      if (options.provision && existsSync(path.join(outDir, "hipster.json"))) {
        const app = JSON.parse(
          readFileSync(path.join(outDir, "package.json"), "utf8"),
        ) as { name: string };
        p.log.info(`${outDir} is an existing app; provisioning only.`);
        const committed =
          spawnExec("git", ["rev-parse", "--verify", "--quiet", "HEAD"], {
            cwd: outDir,
            capture: "all",
          }).status === 0;
        const database = await provisionApp(
          outDir,
          app.name,
          committed,
          templateDir,
          options,
          interactive,
        );
        printNextSteps(
          outDir,
          existsSync(path.join(outDir, "node_modules")),
          database,
        );
        if (interactive) p.outro("Done.");
        return;
      }

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
      let domain = options.preset ?? (modules ? "custom" : "blank");
      if (!modules) {
        if (interactive) ({ domain, modules } = await promptModules(manifest));
        else modules = [];
      }

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

      const clerk: Partial<ClerkKeys> = interactive ? await promptClerk() : {};

      // --provision creates its own database, so only ask without it.
      let databaseUrl = options.databaseUrl?.trim() || undefined;
      if (databaseUrl && !isPostgresUrl(databaseUrl))
        throw new Error("--database-url must be a postgresql:// URL.");
      if (!databaseUrl && interactive && !options.provision) {
        databaseUrl = cancelled(
          await p.text({
            message:
              "Neon connection string (Neon dashboard > Connect; pooled or direct)",
            placeholder:
              "postgresql://neondb_owner:...@ep-...-pooler.<region>.aws.neon.tech/neondb?sslmode=require",
            validate: (value) =>
              value && isPostgresUrl(value)
                ? undefined
                : "Paste the postgresql:// connection string",
          }),
        ).trim();
      }

      const integrations = interactive
        ? await promptIntegrations(integrationVars(manifest, modules))
        : {};
      const access = await accessChoices(options, interactive);
      const env = envPlan(clerk, integrations);

      if (interactive) {
        const requiredVars = integrationVars(manifest, modules).filter(
          (variable) => variable.required,
        );
        await confirmSummary({
          dir: outDir,
          name,
          domain,
          modules,
          ...access,
          color,
          databaseUrl,
          clerk,
          integrations,
          missing: [
            ...(databaseUrl ? [] : ["DATABASE_URL"]),
            ...requiredVars
              .map((variable) => variable.name)
              .filter((key) => !(key in integrations)),
          ],
        });
      }

      const result = await composeApp({
        templateDir,
        outDir,
        modules,
        name,
        color,
        access,
        clerk: {
          ...(clerk.appId ? { appId: clerk.appId } : {}),
          ...(clerk.ngrokDomain ? { ngrokDomain: clerk.ngrokDomain } : {}),
        },
        cliVersion,
        now: new Date(),
      });
      if (Object.keys(env.local).length > 0) writeEnvLocal(outDir, env.local);
      if (Object.keys(env.production).length > 0)
        writeEnvFile(outDir, ".env.production.local", env.production);
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

      let connected = false;
      if (databaseUrl) {
        try {
          await connectDatabase({
            appDir: outDir,
            connectionString: databaseUrl,
            runSql: templateSqlRunner(templateDir),
          });
          connected = true;
          p.log.success(
            "Database wired: DATABASE_URL (app_user, pooled) and DIRECT_DATABASE_URL (owner, direct) are in .env.local.",
          );
        } catch (error) {
          p.log.warn(
            `Could not set up the database (${(error as Error).message}). Fix the connection string and fill DATABASE_URL and DIRECT_DATABASE_URL in .env.local.`,
          );
        }
      }

      const { committed, migrated } = setupApp({
        appDir: outDir,
        templateDir,
        install: options.install,
        git: options.git,
        dbInit: connected,
        exec: spawnExec,
        warn: (message) => p.log.warn(message),
      });

      // Nothing below touches the network without --provision. A wired
      // database makes its Neon step report "exists".
      const provisioned = options.provision
        ? await provisionApp(
            outDir,
            name,
            committed,
            templateDir,
            options,
            interactive,
          )
        : false;
      const database = connected || provisioned;
      printNextSteps(
        outDir,
        options.install,
        database,
        migrated,
        clerk.ngrokDomain,
      );
      if (interactive) p.outro("Done.");
    });
}
