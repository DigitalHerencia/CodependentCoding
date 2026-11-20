import assert from "node:assert/strict";
import { test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import type { AccessContext } from "@/types/authzTypes";
vi.mock("@/lib/authz/permissions", () => ({
  assertPermission: () => undefined,
}));
import { claimIdempotencyTx } from "@/lib/db/transactions/idempotencyTx";
import { processCampaignEventTx } from "@/lib/db/selects/marketingTx";

test("a duplicate idempotency key uses conflict-free insertion so PostgreSQL can replay in the same transaction", async () => {
  const createMany = vi.fn(async (_input: unknown) => ({ count: 0 }));
  const findUniqueOrThrow = vi.fn(async (_input: unknown) => ({
    id: "claim-a",
    state: "COMPLETED",
    result: { id: "audit-a" },
  }));
  const tx = {
    idempotencyRecord: { createMany, findUniqueOrThrow },
  } as unknown as Prisma.TransactionClient;
  const claim = await claimIdempotencyTx(tx, {
    organizationId: "tenant-a",
    scope: "marketing.campaign-event",
    key: "event-a",
  });
  assert.equal(claim.claimed, false);
  assert.deepEqual(createMany.mock.calls[0]?.[0], {
    data: {
      organizationId: "tenant-a",
      scope: "tenant-a:marketing.campaign-event",
      key: "event-a",
      state: "STARTED",
    },
    skipDuplicates: true,
  });
  assert.equal(findUniqueOrThrow.mock.calls.length, 1);
});

test("reused completed event keys must match the requested tenant, campaign and event type", async () => {
  const campaignId = "00000000-0000-4000-8000-000000000001";
  const auditRead = vi.fn(async (_input: unknown) => null);
  const auditCreate = vi.fn();
  const tx = {
    campaign: { findFirst: async () => ({ id: campaignId }) },
    idempotencyRecord: {
      createMany: async () => ({ count: 0 }),
      findUniqueOrThrow: async () => ({
        id: "claim-a",
        state: "COMPLETED",
        result: { id: "audit-a" },
      }),
    },
    auditEvent: { findFirst: auditRead, create: auditCreate },
  } as unknown as Prisma.TransactionClient;
  const access = {
    organizationId: "tenant-a",
    userId: "actor-a",
    membershipId: "member-a",
    clerkUserId: "clerk-a",
    role: "MEMBER",
  } satisfies AccessContext;
  await assert.rejects(
    processCampaignEventTx(tx, access, {
      campaignId,
      eventType: "planned",
      idempotencyKey: "reused",
    }),
    /another campaign event/,
  );
  assert.deepEqual(auditRead.mock.calls[0]?.[0], {
    where: {
      id: "audit-a",
      organizationId: "tenant-a",
      resourceType: "Campaign",
      resourceId: campaignId,
      action: "marketing.campaign.planned",
    },
    select: { id: true },
  });
  assert.equal(auditCreate.mock.calls.length, 0);
});
