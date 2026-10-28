// Why: shared shapes for running the template's checks and showing their progress.
export type CheckStatus = "waiting" | "running" | "passed" | "failed";

export interface CheckDefinition {
  id: string;
  label: string;
  script: string;
}

export interface CheckRun {
  id: string;
  label: string;
  status: CheckStatus;
  durationMs: number | null;
  /** Last lines of output when a check fails. */
  detail: string | null;
}
