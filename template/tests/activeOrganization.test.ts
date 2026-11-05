// Why: pins the active-org cookie (AUTH.md §4.1). A user with two memberships
// can switch, every read follows the cookie, and the cookie is only a
// preference: the tenancy wrapper re-validates it on every request.
import assert from "node:assert/strict";
import { beforeEach, test, vi } from "vitest";

import { ACTIVE_ORGANIZATION_COOKIE } from "@/lib/auth/activeOrganization";

const orgA = "00000000-0000-4000-8000-00000000000a";
const orgB = "00000000-0000-4000-8000-00000000000b";
const orgC = "00000000-0000-4000-8000-00000000000c";

type Membership = {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  status: string;
  createdAt: number;
};

const state = vi.hoisted(() => ({
  jar: new Map<string, { value: string; options: unknown }>(),
  memberships: [] as Membership[],
  invalidated: 0,
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => {
      const entry = state.jar.get(name);
      return entry ? { name, value: entry.value } : undefined;
    },
    set: (name: string, value: string, options: unknown) => {
      state.jar.set(name, { value, options });
    },
  }),
}));

vi.mock("@/lib/auth/auth", () => ({
  requireIdentity: async () => ({ clerkUserId: "user_1" }),
}));

vi.mock("@/lib/cache/invalidate", () => ({
  invalidatePaths: () => undefined,
  invalidateAllPaths: () => {
    state.invalidated += 1;
  },
}));

const matches = (row: Membership, where: Record<string, unknown>) =>
  Object.entries(where).every(
    ([key, value]) => row[key as keyof Membership] === value,
  );

const tx = {
  $executeRaw: async () => 1,
  user: {
    findUnique: async () => ({
      id: "user_1",
      email: "a@example.com",
      displayName: "Alice",
      profileCompletedAt: new Date("2026-01-01T00:00:00Z"),
    }),
  },
  membership: {
    findFirst: async ({ where }: { where: Record<string, unknown> }) => {
      const row = state.memberships
        .filter((membership) => matches(membership, where))
        .sort((a, b) => a.createdAt - b.createdAt)[0];
      return row
        ? { id: row.id, organizationId: row.organizationId, role: row.role }
        : null;
    },
  },
};

vi.mock("@/lib/db/client", () => ({
  prisma: {
    $transaction: async (work: (client: unknown) => Promise<unknown>) =>
      work(tx),
  },
}));

const { withAuthenticatedRead } = await import("@/lib/db/tenant");
const { switchOrganization } = await import("@/lib/actions/commonActions");

const activeOrganization = () =>
  withAuthenticatedRead(async (_tx, access) => access.organizationId);

beforeEach(() => {
  state.jar.clear();
  state.invalidated = 0;
  state.memberships = [
    {
      id: "mem_a",
      userId: "user_1",
      organizationId: orgA,
      role: "OWNER",
      status: "ACTIVE",
      createdAt: 1,
    },
    {
      id: "mem_b",
      userId: "user_1",
      organizationId: orgB,
      role: "VIEWER",
      status: "ACTIVE",
      createdAt: 2,
    },
    {
      id: "mem_c",
      userId: "user_1",
      organizationId: orgC,
      role: "MEMBER",
      status: "INACTIVE",
      createdAt: 3,
    },
  ];
});

test("without a cookie the oldest active membership is used", async () => {
  assert.equal(await activeOrganization(), orgA);
});

test("a two-membership user switches and every read follows", async () => {
  const result = await switchOrganization({ organizationId: orgB });
  assert.deepEqual(result, { ok: true, data: { organizationId: orgB } });
  assert.equal(state.invalidated, 1);
  const cookie = state.jar.get(ACTIVE_ORGANIZATION_COOKIE);
  assert.equal(cookie?.value, orgB);
  assert.deepEqual(cookie?.options, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  const access = await withAuthenticatedRead(async (_tx, context) => context);
  assert.equal(access.organizationId, orgB);
  assert.equal(access.membershipId, "mem_b");
  assert.equal(access.role, "VIEWER");

  await switchOrganization({ organizationId: orgA });
  assert.equal(await activeOrganization(), orgA);
});

test("switching to an organization without an active membership is refused", async () => {
  for (const organizationId of [orgC, "00000000-0000-4000-8000-0000000000ff"]) {
    const result = await switchOrganization({ organizationId });
    assert.equal(result.ok, false);
    assert.equal(!result.ok && result.error.code, "NOT_FOUND");
  }
  const invalid = await switchOrganization({ organizationId: "not-a-uuid" });
  assert.equal(!invalid.ok && invalid.error.code, "VALIDATION");
  assert.equal(state.jar.size, 0);
  assert.equal(state.invalidated, 0);
});

test("a stale or forged cookie falls back to the oldest active membership", async () => {
  for (const value of [orgC, "not-a-uuid"]) {
    state.jar.set(ACTIVE_ORGANIZATION_COOKIE, { value, options: {} });
    assert.equal(await activeOrganization(), orgA);
  }
  // A membership that ends after the switch stops counting on the next request.
  state.jar.set(ACTIVE_ORGANIZATION_COOKIE, { value: orgB, options: {} });
  assert.equal(await activeOrganization(), orgB);
  const b = state.memberships.find((row) => row.id === "mem_b");
  if (b) b.status = "SUSPENDED";
  assert.equal(await activeOrganization(), orgA);
});
