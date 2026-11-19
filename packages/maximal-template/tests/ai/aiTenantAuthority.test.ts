import type { Prisma } from "@/generated/prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fixture = vi.hoisted(() => {
  const authority = {
    organizationId: "00000000-0000-4000-8000-000000000010",
    userId: "clerk-user-1",
    membershipId: "00000000-0000-4000-8000-000000000011",
  };
  const membership = {
    id: authority.membershipId,
    organizationId: authority.organizationId,
    role: "MEMBER" as const,
    deniedPermissions: ["ai.generation:update"],
  };
  const events: string[] = [];
  const lock = vi.fn(
    async (_sql: TemplateStringsArray, ..._values: unknown[]) => {
      events.push("lock");
      return [{ id: authority.membershipId }];
    },
  );
  const selectMembership = vi.fn(
    async (_args: unknown): Promise<typeof membership | null> => {
      events.push("membership");
      return membership;
    },
  );
  const tx = { $queryRaw: lock, membership: { findFirst: selectMembership } };
  return {
    authority,
    membership,
    events,
    lock,
    selectMembership,
    tx,
    cookies: vi.fn(async () => ({
      get: vi.fn(() => ({ value: "00000000-0000-4000-8000-000000000099" })),
      set: vi.fn(),
    })),
    connection: vi.fn(async () => undefined),
    requireIdentity: vi.fn(async () => ({ clerkUserId: authority.userId })),
    user: vi.fn(
      async (
        _tx: unknown,
        _identity: unknown,
      ): Promise<{ id: string; profileCompletedAt: Date | null }> => ({
        id: authority.userId,
        profileCompletedAt: new Date("2026-11-18T00:00:00Z"),
      }),
    ),
    rls: vi.fn(async (_tx: unknown, _context: unknown) => {
      events.push("rls");
    }),
    transaction: vi.fn(
      async (work: (tx: unknown) => Promise<unknown>, _options: unknown) =>
        work(tx),
    ),
  };
});

vi.mock("next/headers", () => ({ cookies: fixture.cookies }));
vi.mock("next/server", () => ({ connection: fixture.connection }));
vi.mock("@/lib/db/client", () => ({
  prisma: { $transaction: fixture.transaction },
}));
vi.mock("@/lib/integrations/clerk/server", () => ({
  requireIdentity: fixture.requireIdentity,
}));
vi.mock("@/lib/db/rls", () => ({
  resolveAuthenticatedUser: fixture.user,
  setRlsContext: fixture.rls,
}));
vi.mock("@/lib/authz/mode", () => ({
  tenancy: "multi",
  SINGLE_ORGANIZATION_ID: "00000000-0000-4000-8000-000000000010",
  activeMembershipScope: (userId: string) => ({ userId, status: "ACTIVE" }),
}));

import { resolveCapturedAccessTx } from "@/lib/authz/tenancy";
import { withCapturedTenantTransaction } from "@/lib/db/tenancy";

const identity = { clerkUserId: fixture.authority.userId };
const client = fixture.tx as unknown as Prisma.TransactionClient;

/** Exercises the real captured-authority helpers with isolated database and request adapters. */
describe("AI captured tenant authority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fixture.events.length = 0;
    fixture.lock.mockImplementation(async () => {
      fixture.events.push("lock");
      return [{ id: fixture.authority.membershipId }];
    });
    fixture.selectMembership.mockImplementation(async () => {
      fixture.events.push("membership");
      return fixture.membership;
    });
    fixture.user.mockResolvedValue({
      id: fixture.authority.userId,
      profileCompletedAt: new Date("2026-11-18T00:00:00Z"),
    });
  });

  it("locks the exact captured member, tenant and user before selecting fresh role restrictions", async () => {
    const access = await resolveCapturedAccessTx(
      client,
      identity,
      fixture.authority,
    );
    const lockCall = fixture.lock.mock.calls[0];
    expect(lockCall?.[0].join("?")).toContain(
      'WHERE "id" = ?::uuid AND "organizationId" = ?::uuid AND "userId" = ? FOR SHARE',
    );
    expect(lockCall?.slice(1)).toEqual([
      fixture.authority.membershipId,
      fixture.authority.organizationId,
      fixture.authority.userId,
    ]);
    expect(fixture.events).toEqual(["lock", "membership"]);
    expect(fixture.selectMembership).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: fixture.authority.membershipId,
          organizationId: fixture.authority.organizationId,
          userId: fixture.authority.userId,
          status: "ACTIVE",
        },
      }),
    );
    expect(access).toEqual({
      ...identity,
      ...fixture.authority,
      role: "MEMBER",
      deniedPermissions: ["ai.generation:update"],
    });
  });

  it("denies a mismatched authenticated identity before locking or querying membership", async () => {
    await expect(
      resolveCapturedAccessTx(
        client,
        { clerkUserId: "another-user" },
        fixture.authority,
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(fixture.lock).not.toHaveBeenCalled();
    expect(fixture.selectMembership).not.toHaveBeenCalled();
  });

  it("denies a missing or revoked original membership without searching for a fallback", async () => {
    fixture.selectMembership.mockResolvedValue(null);
    await expect(
      resolveCapturedAccessTx(client, identity, fixture.authority),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(fixture.selectMembership).toHaveBeenCalledTimes(1);
    expect(fixture.selectMembership).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: fixture.authority.membershipId,
          status: "ACTIVE",
        }),
      }),
    );
  });

  it("fails closed if the authority row lock cannot be acquired", async () => {
    fixture.lock.mockRejectedValue(new Error("lock unavailable"));
    await expect(
      resolveCapturedAccessTx(client, identity, fixture.authority),
    ).rejects.toThrow("lock unavailable");
    expect(fixture.selectMembership).not.toHaveBeenCalled();
  });

  it("establishes captured RLS and current authority without consulting a changed active-organization cookie", async () => {
    const work = vi.fn(
      async (_tx: Prisma.TransactionClient, access: unknown) => {
        fixture.events.push("work");
        return access;
      },
    );
    const access = await withCapturedTenantTransaction(
      identity,
      fixture.authority,
      work,
    );
    expect(fixture.connection).toHaveBeenCalledOnce();
    expect(fixture.user).toHaveBeenCalledWith(fixture.tx, identity);
    expect(fixture.rls).toHaveBeenCalledWith(fixture.tx, {
      organizationId: fixture.authority.organizationId,
    });
    expect(fixture.events).toEqual(["rls", "lock", "membership", "work"]);
    expect(access).toMatchObject({
      ...fixture.authority,
      deniedPermissions: ["ai.generation:update"],
    });
    expect(fixture.cookies).not.toHaveBeenCalled();
    expect(fixture.requireIdentity).not.toHaveBeenCalled();
    expect(fixture.transaction).toHaveBeenCalledWith(expect.any(Function), {
      maxWait: 5_000,
      timeout: 15_000,
    });
  });

  it("rechecks original onboarding before setting tenant RLS or performing the protected write", async () => {
    fixture.user.mockResolvedValue({
      id: fixture.authority.userId,
      profileCompletedAt: null,
    });
    const work = vi.fn(async () => undefined);
    await expect(
      withCapturedTenantTransaction(identity, fixture.authority, work),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(fixture.rls).not.toHaveBeenCalled();
    expect(fixture.lock).not.toHaveBeenCalled();
    expect(work).not.toHaveBeenCalled();
  });

  it("rejects a resolved user different from the captured user", async () => {
    fixture.user.mockResolvedValue({
      id: "another-user",
      profileCompletedAt: new Date("2026-11-18T00:00:00Z"),
    });
    const work = vi.fn(async () => undefined);
    await expect(
      withCapturedTenantTransaction(identity, fixture.authority, work),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(fixture.rls).not.toHaveBeenCalled();
    expect(work).not.toHaveBeenCalled();
  });

  it("stops the protected transition when original authority is gone and never selects another organization", async () => {
    fixture.selectMembership.mockResolvedValue(null);
    const work = vi.fn(async () => undefined);
    await expect(
      withCapturedTenantTransaction(identity, fixture.authority, work),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(fixture.rls).toHaveBeenCalledOnce();
    expect(fixture.rls).toHaveBeenCalledWith(fixture.tx, {
      organizationId: fixture.authority.organizationId,
    });
    expect(fixture.selectMembership).toHaveBeenCalledTimes(1);
    expect(fixture.cookies).not.toHaveBeenCalled();
    expect(work).not.toHaveBeenCalled();
  });
});
