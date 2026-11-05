// Why: the single error mapper (CC-ERR-001/002) never leaks internals and reports INTERNAL under a ref.
import assert from "node:assert/strict";
import { notFound, redirect } from "next/navigation";
import { afterEach, beforeEach, test, vi } from "vitest";
import { z } from "zod";

import {
  ConcurrencyConflictError,
  InvariantViolationError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";
import { reportError } from "@/lib/utils/reportError";
import { toActionResult } from "@/lib/utils/actionResult";

let logged: string[] = [];

beforeEach(() => {
  logged = [];
  vi.spyOn(console, "error").mockImplementation((line: unknown) => {
    logged.push(String(line));
  });
});

afterEach(() => vi.restoreAllMocks());

function coded(code: string, message: string) {
  return Object.assign(new Error(message), { code });
}

const fail = (cause: unknown) => () => Promise.reject(cause);

test("a ZodError is VALIDATION with field errors and nothing is reported", async () => {
  const schema = z.object({ name: z.string().min(1, "Name is required.") });
  const result = await toActionResult(async () => schema.parse({ name: "" }));
  assert.ok(!result.ok);
  assert.equal(result.error.code, "VALIDATION");
  assert.deepEqual(result.error.fieldErrors, { name: ["Name is required."] });
  assert.equal(result.error.ref, undefined);
  assert.deepEqual(logged, []);
});

test("coded domain errors map to fixed messages, never their own", async () => {
  const internal = "postgres://secret@db.internal/app row 42";
  const cases = [
    [coded("UNAUTHENTICATED", internal), "UNAUTHENTICATED"],
    [
      coded(
        "FORBIDDEN",
        "The authenticated Clerk user is not provisioned in the application database.",
      ),
      "FORBIDDEN",
    ],
    [new ResourceNotFoundError(`Project ${internal}`), "NOT_FOUND"],
    [new InvariantViolationError(`Invoice ${internal}`), "VALIDATION"],
    [new ConcurrencyConflictError(`Task ${internal}`), "CONFLICT"],
    [coded("RATE_LIMITED", internal), "RATE_LIMITED"],
  ] as const;
  const messages = new Set<string>();
  for (const [cause, code] of cases) {
    const result = await toActionResult(fail(cause));
    assert.ok(!result.ok);
    assert.equal(result.error.code, code);
    assert.notEqual(result.error.message, cause.message);
    assert.doesNotMatch(result.error.message, /secret|Clerk|database|42/);
    assert.equal(result.error.ref, undefined);
    messages.add(result.error.message);
  }
  assert.equal(messages.size, cases.length);
  assert.deepEqual(logged, []);
});

test("an INTERNAL result carries a ref and a redacted report is logged under it", async () => {
  const cause = coded("ECONNREFUSED", "connection string postgres://secret");
  const result = await toActionResult(fail(cause));
  assert.ok(!result.ok);
  assert.equal(result.error.code, "INTERNAL");
  assert.equal(result.error.message, "Something went wrong. Try again.");
  assert.match(result.error.ref ?? "", /^[0-9a-f-]{36}$/);
  assert.equal(result.error.fieldErrors, undefined);
  assert.equal(logged.length, 1);
  const report = JSON.parse(logged[0] ?? "{}") as Record<string, unknown>;
  assert.equal(report.ref, result.error.ref);
  assert.equal(report.boundary, "action");
  const error = report.error as {
    name: string;
    code?: string;
    frames: string[];
  };
  assert.equal(error.name, "Error");
  assert.equal(error.code, "ECONNREFUSED");
  assert.ok(error.frames.length > 0);
  assert.ok(error.frames.every((frame) => frame.startsWith("at ")));
  // The message (and the stack's first line, which repeats it) is never logged.
  assert.doesNotMatch(logged[0] ?? "", /secret|postgres:|connection string/);
});

test("unknown codes and non-Error throws are INTERNAL, not passed through", async () => {
  for (const cause of [
    coded("INTERNAL", "boom"),
    coded("P2002", "Unique constraint failed on users_email_key"),
    "plain string with secret",
    { code: "user@example.com secret" },
    null,
  ]) {
    const result = await toActionResult(fail(cause));
    assert.ok(!result.ok);
    assert.equal(result.error.code, "INTERNAL");
    assert.ok(result.error.ref);
    assert.doesNotMatch(result.error.message, /boom|users_email|secret/);
  }
  assert.equal(logged.length, 5);
  for (const line of logged)
    assert.doesNotMatch(line, /boom|users_email|secret|example\.com/);
});

test("each report gets a distinct ref", () => {
  const first = reportError(new Error("a"), { boundary: "action" });
  const second = reportError(new Error("a"), { boundary: "action" });
  assert.notEqual(first, second);
});

test("redirect() and notFound() are rethrown as control flow", async () => {
  await assert.rejects(
    toActionResult(async () => redirect("/sign-in")),
    (error: unknown) =>
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT"),
  );
  await assert.rejects(
    toActionResult(async () => notFound()),
    (error: unknown) =>
      String((error as { digest?: string }).digest).startsWith(
        "NEXT_HTTP_ERROR_FALLBACK",
      ),
  );
  assert.deepEqual(logged, []);
});
