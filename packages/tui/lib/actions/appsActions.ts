// Why: the new-app screen's entry point: validate the choices, then compose; never throw.
import { createAppWorkflow } from "@/lib/workflows/appsWorkflows";
import { newAppRequestSchema } from "@/schemas/appsSchemas";
import type { ActionResult } from "@/types/actionTypes";
import type { NewAppOutcome } from "@/types/appsTypes";
import type { CheckRun } from "@/types/checksTypes";

export async function createAppAction(
  input: unknown,
  onProgress: (steps: CheckRun[]) => void,
): Promise<ActionResult<NewAppOutcome>> {
  const parsed = newAppRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: parsed.error.issues.map((issue) => issue.message).join(" "),
      },
    };
  }
  try {
    return { ok: true, data: await createAppWorkflow(parsed.data, onProgress) };
  } catch (error) {
    return {
      ok: false,
      error: { code: "INTERNAL", message: (error as Error).message },
    };
  }
}
