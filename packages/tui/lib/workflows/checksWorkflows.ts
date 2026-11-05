// Why: runs the template's checks one after another and reports each as it finishes.
import path from "node:path";

import { templateChecks } from "@/lib/constants/checks";
import { getWorkspaceInfo } from "@/lib/fetchers/workspaceFetchers";
import { runCommand } from "@/lib/integrations/process/run-command";
import { waitingChecks } from "@/lib/utils/check-runs";
import type { CheckRun } from "@/types/checksTypes";

const DETAIL_LINES = 12;

export async function runTemplateChecksWorkflow(
  onProgress: (runs: CheckRun[]) => void,
): Promise<CheckRun[]> {
  const { root } = await getWorkspaceInfo();
  const cwd = path.join(root, "packages/maximal-template");
  let runs = waitingChecks();
  const update = (id: string, change: Partial<CheckRun>) => {
    runs = runs.map((run) => (run.id === id ? { ...run, ...change } : run));
    onProgress(runs);
  };
  for (const check of templateChecks) {
    update(check.id, { status: "running" });
    const pluginCheck = ["lint", "check:modules", "check:ownership"].includes(
      check.script,
    );
    const result = pluginCheck
      ? await runCommand(
          process.execPath,
          [
            path.join(root, "packages/loaded-vibes/scripts/app.mjs"),
            check.script,
            "--app",
            cwd,
          ],
          cwd,
        )
      : await runCommand("pnpm", ["run", check.script], cwd);
    update(check.id, {
      status: result.code === 0 ? "passed" : "failed",
      durationMs: result.durationMs,
      detail:
        result.code === 0
          ? null
          : result.output.trim().split("\n").slice(-DETAIL_LINES).join("\n"),
    });
  }
  return runs;
}
