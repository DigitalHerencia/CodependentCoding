// Why: plans a slice, checks its paths against the doctrine, writes it, then verifies the app.
import path from "node:path";

import { findUnplacedPaths } from "@/lib/fetchers/doctrineFetchers";
import { changedFiles } from "@/lib/integrations/git/status";
import {
  formatAppSlice,
  planAppSlice,
  writeAppSlice,
} from "@/lib/integrations/hipster-stack/slice";
import { runCommand } from "@/lib/integrations/process/run-command";
import type { CheckRun } from "@/types/checksTypes";
import type {
  SliceOutcome,
  SlicePreview,
  SliceRequest,
} from "@/types/slicesTypes";

const STEPS = [
  ["doctrine", "Check paths against the doctrine"],
  ["write", "Write files"],
  ["format", "Format (prisma, Prettier, eslint --fix)"],
  ["lint", "Lint the app"],
  ["typecheck", "Type-check the app"],
] as const;

export async function previewSliceWorkflow(
  request: SliceRequest,
): Promise<SlicePreview> {
  const plan = await planAppSlice(request);
  return {
    appDir: path.resolve(request.appDir),
    entity: plan.names.Entity,
    moduleId: request.moduleId,
    newModule: plan.newModule,
    created: plan.created,
    updated: plan.updated,
  };
}

export async function createSliceWorkflow(
  request: SliceRequest,
  onProgress: (steps: CheckRun[]) => void,
): Promise<SliceOutcome> {
  const appDir = path.resolve(request.appDir);
  let steps: CheckRun[] = STEPS.map(([id, label]) => ({
    id,
    label,
    status: "waiting",
    durationMs: null,
    detail: null,
  }));
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
    const problem = await work();
    set({
      status: problem ? "failed" : "passed",
      durationMs: Date.now() - started,
      detail: problem,
    });
    return !problem;
  };
  const tail = (output: string) =>
    output.trim().split("\n").slice(-12).join("\n");

  const plan = await planAppSlice(request);
  const ok =
    (await step("doctrine", async () => {
      const unplaced = await findUnplacedPaths([...plan.writes.keys()]);
      return unplaced.length > 0
        ? `No layer for: ${unplaced.join(", ")}`
        : null;
    })) &&
    (await step("write", async () => {
      writeAppSlice(appDir, plan);
      return null;
    })) &&
    (await step("format", async () => {
      const failures = formatAppSlice(appDir, plan);
      return failures.length > 0 ? failures.join("\n") : null;
    }));
  if (ok) {
    for (const script of ["lint", "typecheck"] as const) {
      await step(script, async () => {
        const result = await runCommand("pnpm", ["run", script], appDir);
        return result.code === 0 ? null : tail(result.output);
      });
    }
  }
  return { steps, changes: await changedFiles(appDir) };
}
