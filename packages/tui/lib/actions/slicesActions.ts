// Why: the slice screen's entry points: validate the form, then plan or create; never throw.
import {
  createSliceWorkflow,
  previewSliceWorkflow,
} from "@/lib/workflows/slicesWorkflows";
import { sliceRequestSchema } from "@/schemas/slicesSchemas";
import type { ActionResult } from "@/types/actionTypes";
import type { CheckRun } from "@/types/checksTypes";
import type {
  SliceOutcome,
  SlicePreview,
  SliceRequest,
} from "@/types/slicesTypes";

function parse(input: unknown): ActionResult<SliceRequest> {
  const parsed = sliceRequestSchema.safeParse(input);
  return parsed.success
    ? { ok: true, data: parsed.data }
    : {
        ok: false,
        error: {
          code: "VALIDATION",
          message: parsed.error.issues.map((issue) => issue.message).join(" "),
        },
      };
}

const failed = (error: unknown) =>
  ({
    ok: false,
    error: { code: "INTERNAL", message: (error as Error).message },
  }) as const;

export async function previewSliceAction(
  input: unknown,
): Promise<ActionResult<SlicePreview>> {
  const request = parse(input);
  if (!request.ok) return request;
  try {
    return { ok: true, data: await previewSliceWorkflow(request.data) };
  } catch (error) {
    return failed(error);
  }
}

export async function createSliceAction(
  input: unknown,
  onProgress: (steps: CheckRun[]) => void,
): Promise<ActionResult<SliceOutcome>> {
  const request = parse(input);
  if (!request.ok) return request;
  try {
    return {
      ok: true,
      data: await createSliceWorkflow(request.data, onProgress),
    };
  } catch (error) {
    return failed(error);
  }
}
