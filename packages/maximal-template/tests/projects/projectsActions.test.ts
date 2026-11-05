// Why: actions return the ActionResult contract (AUTH.md §8) for every failure path.
import assert from "node:assert/strict";
import { beforeEach, test, vi } from "vitest";

import type * as Auth from "@/lib/auth/auth";
import type { AccessContext } from "@/types/accessTypes";

const state = vi.hoisted(() => ({
  signedIn: true,
  role: "MEMBER" as string,
  tx: {} as Record<string, unknown>,
  invalidated: [] as string[],
}));

vi.mock("@/lib/auth/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof Auth>();
  return {
    ...actual,
    requireIdentity: async () => {
      if (!state.signedIn) throw new actual.AuthenticationRequiredError();
      return { clerkUserId: "user_a" };
    },
  };
});

vi.mock("@/lib/db/tenant", () => ({
  withTenantTransaction: async (
    _identity: unknown,
    work: (tx: unknown, access: AccessContext) => Promise<unknown>,
  ) =>
    work(state.tx, {
      clerkUserId: "user_a",
      organizationId: "org-a",
      membershipId: "membership-a",
      userId: "local-user-a",
      role: state.role,
    } as AccessContext),
}));

vi.mock("@/lib/cache/invalidate", () => ({
  invalidatePaths: (paths: string[]) => state.invalidated.push(...paths),
  invalidateTags: () => undefined,
}));

const { createProject, updateProject } =
  await import("@/lib/actions/projectsActions");

const projectId = "00000000-0000-4000-8000-000000000001";
const row = {
  id: projectId,
  name: "Launch",
  description: null,
  status: "PLANNED",
  startsAt: null,
  dueAt: null,
  version: 1,
  _count: { tasks: 0 },
  tasks: [],
};

beforeEach(() => {
  state.signedIn = true;
  state.role = "MEMBER";
  state.tx = {};
  state.invalidated = [];
});

test("signed-out callers get UNAUTHENTICATED", async () => {
  state.signedIn = false;
  const result = await createProject({ name: "Launch" });
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.error.code, "UNAUTHENTICATED");
});

test("roles without projects.project:create get FORBIDDEN before any write", async () => {
  state.role = "VIEWER";
  state.tx = {
    project: {
      create: () => assert.fail("viewer reached the write"),
    },
  };
  const result = await createProject({ name: "Launch" });
  assert.equal(!result.ok && result.error.code, "FORBIDDEN");
});

test("invalid input is VALIDATION with field errors", async () => {
  const result = await createProject({
    name: "",
    startsAt: "2026-10-10",
    dueAt: "2026-10-01",
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.code, "VALIDATION");
  assert.ok(result.error.fieldErrors?.name);
  assert.deepEqual(result.error.fieldErrors?.dueAt, [
    "Due date must follow start date.",
  ]);
});

test("a stale version is CONFLICT; a foreign id is NOT_FOUND", async () => {
  const input = { projectId, expectedVersion: 3, name: "Launch" };
  state.tx = {
    project: {
      updateMany: async () => ({ count: 0 }),
      count: async () => 1,
    },
  };
  const stale = await updateProject(input);
  assert.equal(!stale.ok && stale.error.code, "CONFLICT");

  state.tx = {
    project: {
      updateMany: async () => ({ count: 0 }),
      count: async () => 0,
    },
  };
  const foreign = await updateProject(input);
  assert.equal(!foreign.ok && foreign.error.code, "NOT_FOUND");
  assert.deepEqual(state.invalidated, []);
});

test("unexpected failures are INTERNAL and do not leak the message", async () => {
  state.tx = {
    project: {
      create: async () => {
        throw new Error("connection string postgres://secret");
      },
    },
  };
  const result = await createProject({ name: "Launch" });
  assert.equal(!result.ok && result.error.code, "INTERNAL");
  assert.doesNotMatch(!result.ok ? result.error.message : "", /secret/);
});

test("a successful write returns the DTO and invalidates project routes", async () => {
  state.tx = {
    project: {
      create: async ({ data }: { data: { organizationId: string } }) => {
        assert.equal(data.organizationId, "org-a");
        return row;
      },
    },
    auditEvent: { create: async () => ({}) },
  };
  const result = await createProject({ name: "Launch" });
  assert.equal(result.ok, true);
  assert.equal(result.ok && result.data.id, projectId);
  assert.deepEqual(state.invalidated, ["/projects"]);
});
