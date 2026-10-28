// Why: the starting state of a run: every step waiting (the template checks by default).
import { templateChecks } from "@/lib/constants/checks";
import type { CheckRun } from "@/types/checksTypes";

export function waitingChecks(
  checks: readonly { id: string; label: string }[] = templateChecks,
): CheckRun[] {
  return checks.map((check) => ({
    id: check.id,
    label: check.label,
    status: "waiting",
    durationMs: null,
    detail: null,
  }));
}
