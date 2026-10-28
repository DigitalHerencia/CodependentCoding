// Why: the hipster-stack CLI's slice engine, so the terminal app and `hipster-stack slice` write the same files.
import path from "node:path";

import { quietExec } from "@/lib/integrations/hipster-stack/exec";
import { parseFields } from "hipster-stack/fields";
import {
  formatPlan,
  planSlice,
  type SlicePlan,
  writePlan,
} from "hipster-stack/slice";

import type { SliceRequest } from "@/types/slicesTypes";

export type { SlicePlan };

export function planAppSlice(request: SliceRequest): Promise<SlicePlan> {
  return planSlice({
    appDir: path.resolve(request.appDir),
    entity: request.entity,
    moduleId: request.moduleId,
    fields: parseFields(request.fields),
  });
}

export function writeAppSlice(appDir: string, plan: SlicePlan): void {
  writePlan(path.resolve(appDir), plan);
}

/** prisma format/generate, Prettier and eslint --fix; returns the steps that failed. */
export function formatAppSlice(appDir: string, plan: SlicePlan): string[] {
  return formatPlan(path.resolve(appDir), plan, quietExec);
}
