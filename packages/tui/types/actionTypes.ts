// Why: action results, same contract as the template's (AUTH.md §8): actions return these and never throw.
export type ActionErrorCode = "VALIDATION" | "NOT_FOUND" | "INTERNAL";

export interface ActionError {
  code: ActionErrorCode;
  message: string;
}

export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: ActionError };
