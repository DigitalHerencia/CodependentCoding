// Why: the single server-side error-reporting hook; returns the correlation ref the user sees.
import "server-only";

/** Coded facts about where an error happened. Never tokens, secrets, payloads or full PII. */
export interface ErrorReportContext {
  boundary: "action" | "fetcher" | "route" | "webhook" | "job";
  [fact: string]: string | number | boolean | undefined;
}

/**
 * Reports an unexpected error with its full detail under a fresh correlation
 * ID and returns that ID so the client can quote it as `ref`. The provider
 * (console today; Vercel Observability, Sentry or similar later) can change
 * without changing this signature.
 */
export function reportError(
  cause: unknown,
  context: ErrorReportContext,
): string {
  const ref = crypto.randomUUID();
  const error =
    cause instanceof Error
      ? { name: cause.name, message: cause.message, stack: cause.stack }
      : { name: "NonError", message: String(cause) };
  console.error(JSON.stringify({ level: "error", ref, ...context, error }));
  return ref;
}
