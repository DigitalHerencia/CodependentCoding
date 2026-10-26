import assert from "node:assert/strict";
import { test } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import {
  acceptInvitationTx,
  hashInvitationToken,
} from "@/lib/db/transactions/invitation.tx";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { acceptInvitationSchema } from "@/schemas/commonSchemas";

const invitation = {
  id: "invite-1",
  organizationId: "org-1",
  role: "VIEWER" as const,
};

type Membership = { id: string; status: string } | null;

function fixture(state: { pending: boolean; membership: Membership }) {
  const calls: string[] = [];
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
      update: async ({ data }: { data: { role: string } }) => {
        calls.push(`reactivate:${data.role}`);
        return { id: state.membership?.id };
      },
    },
    auditEvent: {
      create: async () => {
        calls.push("audit");
      },
    },
  } as unknown as Prisma.TransactionClient;
  return { tx, calls };
}

test("accepting creates the membership with the invited role, once", async () => {
  const { tx, calls } = fixture({ pending: true, membership: null });
  const first = await acceptInvitationTx(tx, invitation, "user-1");
  const again = await acceptInvitationTx(tx, invitation, "user-1");
  assert.deepEqual(first, {
    membershipId: "member-new",
    organizationId: "org-1",
  });
  assert.deepEqual(again, first);
  assert.deepEqual(calls, ["create:VIEWER", "audit"]);
});

test("accepting reactivates a suspended membership", async () => {
  const { tx, calls } = fixture({
    pending: true,
    membership: { id: "member-old", status: "SUSPENDED" },
  });
  const result = await acceptInvitationTx(tx, invitation, "user-1");
  assert.equal(result.membershipId, "member-old");
  assert.deepEqual(calls, ["reactivate:VIEWER", "audit"]);
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
