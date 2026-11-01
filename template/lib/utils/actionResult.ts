import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";

import { reportError } from "@/lib/observability/report";
import type { ActionErrorCode, ActionResult } from "@/types/actionTypes";

type CodedErrorCode = Exclude<ActionErrorCode, "INTERNAL">;

/** Fixed, user-facing messages. A thrown error's own message never reaches the client. */
const clientMessage: Record<CodedErrorCode, string> = {
  UNAUTHENTICATED: "Sign in to continue.",
  FORBIDDEN: "You don't have access to do that.",
  NOT_FOUND: "That item doesn't exist or was removed.",
  VALIDATION: "Check the highlighted fields.",
  CONFLICT: "Someone else changed this. Reload and try again.",
  RATE_LIMITED: "Too many requests. Wait a moment and try again.",
};

function codeOf(cause: unknown): CodedErrorCode | undefined {
  const code = (cause as { code?: unknown } | null)?.code;
  return typeof code === "string" && Object.hasOwn(clientMessage, code)
    ? (code as CodedErrorCode)
    : undefined;
}

/**
 * The single error mapper (CC-ERR-001): runs an action body and converts any
 * failure into a client-safe `ActionResult`. Next control flow is rethrown,
 * `ZodError` becomes VALIDATION with field errors, coded domain errors get a
 * fixed message, and anything else is reported and returned as INTERNAL with
 * its correlation `ref` (CC-ERR-002).
 */
export async function toActionResult<T>(
  run: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await run() };
  } catch (cause) {
    // redirect() and notFound() are control flow, not failures.
    unstable_rethrow(cause);
    if (cause instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of cause.issues) {
        (fieldErrors[issue.path.join(".") || "form"] ??= []).push(
          issue.message,
        );
      }
      return {
        ok: false,
        error: {
          code: "VALIDATION",
          message: clientMessage.VALIDATION,
          fieldErrors,
        },
      };
    }
    const code = codeOf(cause);
    if (code)
      return { ok: false, error: { code, message: clientMessage[code] } };
    const ref = reportError(cause, { boundary: "action" });
    return {
      ok: false,
      error: {
        code: "INTERNAL",
        message: "Something went wrong. Try again.",
        ref,
      },
    };
  }
}
