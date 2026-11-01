// Why: the single server-side error-reporting hook; returns the correlation ref the user sees.
import "server-only";

/** Coded facts about where an error happened. Never tokens, secrets, payloads or full PII. */
export interface ErrorReportContext {
  boundary: "action" | "fetcher" | "route" | "webhook" | "job";
  [fact: string]: string | number | boolean | undefined;
}

const MAX_FRAMES = 20;

/**
 * Only the call-site frames of a stack. The first stack line repeats the
 * error message (which may hold a secret or PII), so it is never kept.
 */
function framesOf(stack: string | undefined): string[] {
  if (!stack) return [];
  return stack
    .split("\n")
    .filter((line) => /^\s+at\s/.test(line))
    .slice(0, MAX_FRAMES)
    .map((line) => line.trim());
}

/**
 * Allowlisted facts about an error: its class name, a string `code` if it
 * has one, and its stack frames. Never the message, which can carry
 * credentials, connection strings or personal data (CC-SEC-003, CC-SEC-005).
 */
function describe(cause: unknown) {
  if (!(cause instanceof Error))
    return { name: "NonError", type: typeof cause };
  const code = (cause as { code?: unknown }).code;
  return {
    name: cause.name,
    ...(typeof code === "string" && /^[A-Z0-9_]{1,64}$/i.test(code)
      ? { code }
      : {}),
    frames: framesOf(cause.stack),
  };
}

/**
 * Reports an unexpected error under a fresh correlation ID and returns that
 * ID so the client can quote it as `ref`. The provider (console today; Vercel
 * Observability, Sentry or similar later) can change without changing this
 * signature.
 */
export function reportError(
  cause: unknown,
  context: ErrorReportContext,
): string {
  const ref = crypto.randomUUID();
  console.error(
    JSON.stringify({ level: "error", ref, ...context, error: describe(cause) }),
  );
  return ref;
}
