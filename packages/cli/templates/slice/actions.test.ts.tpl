// Why: {{entity}} actions return the ActionResult contract (AUTH.md §8) for every failure path.
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

const { create{{Entity}}, update{{Entity}} } =
  await import("@/lib/actions/{{module}}Actions");

const id = "00000000-0000-4000-8000-000000000001";
const valid = {{validInput}};
const row = {
  id,
{{sampleRow}}
  version: 1,
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};
/** Referenced rows resolve inside the organization. */
const refs = {
{{refMocks}}
};

beforeEach(() => {
  state.signedIn = true;
  state.role = "MEMBER";
  state.tx = {};
  state.invalidated = [];
});

test("signed-out callers get UNAUTHENTICATED", async () => {
  state.signedIn = false;
  const result = await create{{Entity}}(valid);
  assert.equal(!result.ok && result.error.code, "UNAUTHENTICATED");
});

test("roles without {{resource}}:create get FORBIDDEN before any write", async () => {
  state.role = "VIEWER";
  state.tx = {
    {{entity}}: { create: () => assert.fail("viewer reached the write") },
  };
  const result = await create{{Entity}}(valid);
  assert.equal(!result.ok && result.error.code, "FORBIDDEN");
});

test("invalid input is VALIDATION", async () => {
  const result = await create{{Entity}}({{invalidInput}});
  assert.equal(!result.ok && result.error.code, "VALIDATION");
});

test("a stale version is CONFLICT; a foreign id is NOT_FOUND", async () => {
  const input = { ...valid, {{param}}: id, expectedVersion: 3 };
  state.tx = {
    ...refs,
    {{entity}}: { updateMany: async () => ({ count: 0 }), count: async () => 1 },
  };
  const stale = await update{{Entity}}(input);
  assert.equal(!stale.ok && stale.error.code, "CONFLICT");

  state.tx = {
    ...refs,
    {{entity}}: { updateMany: async () => ({ count: 0 }), count: async () => 0 },
  };
  const foreign = await update{{Entity}}(input);
  assert.equal(!foreign.ok && foreign.error.code, "NOT_FOUND");
  assert.deepEqual(state.invalidated, []);
});

test("a successful create returns the DTO and invalidates {{entity}} routes", async () => {
  state.tx = {
    ...refs,
    {{entity}}: {
      create: async ({ data }: { data: { organizationId: string } }) => {
        assert.equal(data.organizationId, "org-a");
        return row;
      },
    },
    auditEvent: { create: async () => ({}) },
  };
  const result = await create{{Entity}}(valid);
  assert.equal(result.ok && result.data.id, id);
  assert.deepEqual(state.invalidated, ["/{{route}}", `/{{route}}/${id}`]);
});
