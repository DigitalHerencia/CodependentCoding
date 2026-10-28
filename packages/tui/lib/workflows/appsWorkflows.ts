// Why: makes a new app from a preset: compose, validate, install, first commit, with live progress.
import path from "node:path";

import { updateSettingsTx } from "@/lib/db/transactions/settings-update.tx";
import { forgetGeneratedApps } from "@/lib/fetchers/appsFetchers";
import { getModuleCatalog } from "@/lib/fetchers/modulesFetchers";
import { forgetSettings } from "@/lib/fetchers/settingsFetchers";
import { getWorkspaceInfo } from "@/lib/fetchers/workspaceFetchers";
import {
  composeNewApp,
  INITIAL_COMMIT,
  validateNewApp,
} from "@/lib/integrations/hipster-stack/compose";
import { runCommand } from "@/lib/integrations/process/run-command";
import { waitingChecks } from "@/lib/utils/check-runs";
import type { NewAppOutcome, NewAppRequest } from "@/types/appsTypes";
import type { CheckRun } from "@/types/checksTypes";

const STEPS = [
  { id: "compose", label: "Copy the template with the preset's modules" },
  { id: "validate", label: "Validate the database schema" },
  { id: "install", label: "Install packages (pnpm install)" },
  { id: "git", label: "First commit" },
];

export async function createAppWorkflow(
  request: NewAppRequest,
  onProgress: (steps: CheckRun[]) => void,
): Promise<NewAppOutcome> {
  const appDir = path.resolve(request.appDir);
  const templateDir = path.join((await getWorkspaceInfo()).root, "template");
  const { presets } = await getModuleCatalog();
  let modules = presets[request.preset] ?? [];
  let steps = waitingChecks(STEPS);
  const step = async (
    id: string,
    work: () => Promise<string | null>,
  ): Promise<boolean> => {
    const started = Date.now();
    const set = (change: Partial<CheckRun>) => {
      steps = steps.map((run) => (run.id === id ? { ...run, ...change } : run));
      onProgress(steps);
    };
    set({ status: "running" });
    let problem: string | null;
    try {
      problem = await work();
    } catch (error) {
      problem = (error as Error).message;
    }
    set({
      status: problem ? "failed" : "passed",
      durationMs: Date.now() - started,
      detail: problem,
    });
    return !problem;
  };
  const run = async (command: string, args: string[]) => {
    const result = await runCommand(command, args, appDir);
    return result.code === 0
      ? null
      : result.output.trim().split("\n").slice(-12).join("\n");
  };

  // Each step runs only when the one before it passed.
  const passed =
    (await step("compose", async () => {
      modules = await composeNewApp(request, templateDir, modules);
      await rememberApp(appDir);
      return null;
    })) &&
    (await step("validate", async () => {
      validateNewApp(appDir, templateDir);
      return null;
    })) &&
    (await step("install", () =>
      run("pnpm", ["install", "--no-frozen-lockfile"]),
    ));
  if (passed) {
    await step("git", async () => {
      return (
        (await run("git", ["init", "--quiet"])) ??
        (await run("git", ["add", "--all"])) ??
        (await run("git", ["commit", "--quiet", "-m", INITIAL_COMMIT]))
      );
    });
  }
  return { appDir, modules, steps };
}

/** Puts an app first in the remembered list (once) so the apps screen shows it. */
export async function rememberApp(appDir: string): Promise<string[]> {
  const { apps } = await updateSettingsTx((current) => ({
    ...current,
    apps: [appDir, ...current.apps.filter((dir) => dir !== appDir)],
  }));
  forgetSettings();
  forgetGeneratedApps();
  return apps;
}

export async function forgetApp(appDir: string): Promise<string[]> {
  const { apps } = await updateSettingsTx((current) => ({
    ...current,
    apps: current.apps.filter((dir) => dir !== appDir),
  }));
  forgetSettings();
  forgetGeneratedApps();
  return apps;
}
