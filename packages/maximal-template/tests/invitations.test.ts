import assert from "node:assert/strict";
import { beforeEach, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import {
  acceptInvitationTx,
  hashInvitationToken,
} from "@/lib/db/selects/invitationTx";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { acceptInvitationSchema } from "@/schemas/invitationSchemas";

import { SINGLE_ORGANIZATION_ID } from "@/lib/authz/mode";
import type * as AuthzMode from "@/lib/authz/mode";

const mode = vi.hoisted(() => ({ tenancy: "multi" }));
vi.mock("@/lib/authz/mode", async (importOriginal) => ({
  ...(await importOriginal<typeof AuthzMode>()),
  get tenancy() {
    return mode.tenancy;
  },
}));
beforeEach(() => {
  mode.tenancy = "multi";
});

const invitation = {
  id: "invite-1",
  organizationId: SINGLE_ORGANIZATION_ID,
  role: "VIEWER" as const,
  createdAt: new Date("2026-01-01"),
};

type Membership = {
  id: string;
  status: string;
  role?: string;
  createdAt?: Date;
  deniedPermissions?: string[];
} | null;

function fixture(state: { pending: boolean; membership: Membership }) {
  const calls: string[] = [];
  const audits: unknown[] = [];
  const tx = {
    $executeRaw: async () => 1,
    invitation: {
      updateMany: async ({ where }: { where: Record<string, string> }) => {
        assert.equal(where.organizationId, invitation.organizationId);
        assert.equal(where.status, "PENDING");
        const count = state.pending ? 1 : 0;
        state.pending = false;
        return { count };
      },
    },
    membership: {
      findUnique: async () => state.membership,
      create: async ({ data }: { data: { role: string } }) => {
        calls.push(`create:${data.role}`);
        state.membership = { id: "member-new", status: "ACTIVE" };
        return { id: "member-new" };
      },
      updateMany: async ({
        where,
        data,
      }: {
        where: { role: string; status: string; createdAt: { gte: Date } };
        data: { role: string };
      }) => {
        if (
          state.membership?.role !== where.role ||
          state.membership.status !== where.status ||
          !state.membership.createdAt ||
          state.membership.createdAt < where.createdAt.gte
        )
          return { count: 0 };
        state.membership.role = data.role;
        calls.push(`promote:${data.role}`);
        return { count: 1 };
      },
      update: async ({ data }: { data: { role: string } }) => {
        calls.push(`reactivate:${data.role}`);
        return { id: state.membership?.id };
      },
    },
    auditEvent: {
      create: async (args: unknown) => {
        audits.push(args);
        calls.push("audit");
      },
    },
  } as unknown as Prisma.TransactionClient;
  return { tx, calls, audits };
}

test("accepting creates the membership with the invited role, once", async () => {
  const { tx, calls } = fixture({ pending: true, membership: null });
  const first = await acceptInvitationTx(tx, invitation, "user-1");
  const again = await acceptInvitationTx(tx, invitation, "user-1");
  assert.deepEqual(first, {
    membershipId: "member-new",
    organizationId: SINGLE_ORGANIZATION_ID,
  });
  assert.deepEqual(again, first);
  assert.deepEqual(calls, ["create:VIEWER", "audit"]);
});

test("accepting cannot reactivate a suspended membership", async () => {
  const { tx, calls } = fixture({
    pending: true,
    membership: { id: "member-old", status: "SUSPENDED" },
  });
  await assert.rejects(
    acceptInvitationTx(tx, invitation, "user-1"),
    ResourceNotFoundError,
  );
  assert.deepEqual(calls, []);
});

test("single tenancy rejects an invitation for an unconfigured organization", async () => {
  const { tx, calls } = fixture({ pending: true, membership: null });
  mode.tenancy = "single";
  await assert.rejects(
    acceptInvitationTx(
      tx,
      { ...invitation, organizationId: "00000000-0000-4000-8000-000000000099" },
      "user-1",
    ),
    /organization/,
  );
  assert.deepEqual(calls, []);
});

test("single tenancy assigns the invited role to a newer automatic VIEWER once", async () => {
  mode.tenancy = "single";
  const member = {
    id: "member-viewer",
    status: "ACTIVE",
    role: "VIEWER",
    createdAt: new Date("2026-01-02"),
    deniedPermissions: ["base.dashboard:update"],
  };
  const { tx, calls, audits } = fixture({ pending: true, membership: member });
  await acceptInvitationTx(tx, { ...invitation, role: "ADMIN" }, "user-1");
  await acceptInvitationTx(tx, { ...invitation, role: "ADMIN" }, "user-1");
  assert.equal(member.role, "ADMIN");
  assert.deepEqual(member.deniedPermissions, ["base.dashboard:update"]);
  assert.deepEqual(calls, ["promote:ADMIN", "audit"]);
  assert.deepEqual(audits, [
    {
      data: {
        organizationId: SINGLE_ORGANIZATION_ID,
        actorUserId: "user-1",
        action: "membership.invitation.accepted",
        resourceType: "Invitation",
        resourceId: invitation.id,
        metadata: { role: "ADMIN", previousRole: "VIEWER", nextRole: "ADMIN" },
      },
    },
  ]);
});

test.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"])(
  "single tenancy preserves preexisting %s access",
  async (role) => {
    mode.tenancy = "single";
    const member = {
      id: "member-existing",
      status: "ACTIVE",
      role,
      createdAt: new Date("2025-01-01"),
    };
    const { tx, calls } = fixture({ pending: true, membership: member });
    await acceptInvitationTx(tx, { ...invitation, role: "ADMIN" }, "user-1");
    assert.equal(member.role, role);
    assert.deepEqual(calls, ["audit"]);
  },
);

test("ordinary invitations cannot grant OWNER", async () => {
  const { tx, calls } = fixture({ pending: true, membership: null });
  await assert.rejects(
    acceptInvitationTx(tx, { ...invitation, role: "OWNER" }, "user-1"),
    ResourceNotFoundError,
  );
  assert.deepEqual(calls, []);
});

test("an active member keeps their role when accepting", async () => {
  const { tx, calls } = fixture({
    pending: true,
    membership: { id: "member-admin", status: "ACTIVE" },
  });
  const result = await acceptInvitationTx(tx, invitation, "user-1");
  assert.equal(result.membershipId, "member-admin");
  assert.deepEqual(calls, ["audit"]);
});

test("a revoked or used invitation without a membership is not found", async () => {
  const { tx, calls } = fixture({ pending: false, membership: null });
  await assert.rejects(
    acceptInvitationTx(tx, invitation, "user-1"),
    ResourceNotFoundError,
  );
  assert.deepEqual(calls, []);
});

test("tokens are stored as SHA-256 and validated by length", () => {
  assert.match(hashInvitationToken("token"), /^[0-9a-f]{64}$/);
  assert.notEqual(hashInvitationToken("a"), hashInvitationToken("b"));
  assert.equal(
    acceptInvitationSchema.safeParse({ token: "short" }).success,
    false,
  );
  assert.equal(
    acceptInvitationSchema.safeParse({ token: "x".repeat(43) }).success,
    true,
  );
});
