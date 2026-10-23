import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";

import type {
  ActionError,
  ActionErrorCode,
  ActionResult,
} from "@/types/actionTypes";

const codes = new Set<string>([
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "VALIDATION",
  "CONFLICT",
  "RATE_LIMITED",
]);

/**
 * Maps a thrown error to the action error contract. Errors that carry a known
 * `code` keep their message; anything else is INTERNAL with a generic message
 * so internals never reach the client.
 */
export function toActionError(cause: unknown): ActionError {
  if (cause instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of cause.issues) {
      const field = issue.path.join(".") || "form";
      (fieldErrors[field] ??= []).push(issue.message);
    }
    return {
      code: "VALIDATION",
      message: "Check the highlighted fields.",
      fieldErrors,
    };
  }
  const code = (cause as { code?: unknown } | null)?.code;
  if (typeof code === "string" && codes.has(code) && cause instanceof Error) {
    return { code: code as ActionErrorCode, message: cause.message };
  }
  return { code: "INTERNAL", message: "Something went wrong. Try again." };
}

/** Runs an action body and returns its `ActionResult`. */
export async function toActionResult<T>(
  run: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await run() };
  } catch (cause) {
    // redirect() and notFound() are control flow, not failures.
    unstable_rethrow(cause);
    return { ok: false, error: toActionError(cause) };
  }
}
