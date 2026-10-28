// Why: the starting state of a checks run: every template check waiting.
import { templateChecks } from "@/lib/constants/checks";
import type { CheckRun } from "@/types/checksTypes";

export function waitingChecks(): CheckRun[] {
  return templateChecks.map((check) => ({
    id: check.id,
    label: check.label,
    status: "waiting",
    durationMs: null,
    detail: null,
  }));
}
