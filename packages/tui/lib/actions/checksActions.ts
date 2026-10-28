// Why: the entry point a screen calls to run the template checks; returns a result, never throws.
import { runTemplateChecksWorkflow } from "@/lib/workflows/checksWorkflows";
import type { ActionResult } from "@/types/actionTypes";
import type { CheckRun } from "@/types/checksTypes";

export async function runTemplateChecksAction(
  onProgress: (runs: CheckRun[]) => void,
): Promise<ActionResult<CheckRun[]>> {
  try {
    return { ok: true, data: await runTemplateChecksWorkflow(onProgress) };
  } catch (error) {
    return {
      ok: false,
      error: { code: "INTERNAL", message: (error as Error).message },
    };
  }
}
