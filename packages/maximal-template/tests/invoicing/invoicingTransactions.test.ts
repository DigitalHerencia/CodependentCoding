import assert from "node:assert/strict";
import { test } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import { transitionInvoiceTx } from "@/lib/db/selects/invoicingTx";

const command = {
  organizationId: "tenant-a",
  invoiceId: "invoice-a",
  actorUserId: "actor-a",
  membershipId: "member-a",
  expectedVersion: 3,
  command: "issue" as const,
};

test("issuance cannot bypass approval, including direct transaction callers", async () => {
  let writes = 0;
  const tx = {
    invoice: {
      findFirst: async () => ({
        status: "DRAFT",
        version: 3,
        approvedAt: null,
        approvedByMembershipId: null,
      }),
      updateMany: async () => {
        writes++;
        return { count: 1 };
      },
    },
    auditEvent: {
      create: async () => {
        writes++;
      },
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(transitionInvoiceTx(tx, command), /invalid/);
  assert.equal(writes, 0);
});
test("issuance retains exact tenant, version, status, and approval predicates", async () => {
  let audits = 0;
  const approvedAt = new Date("2026-11-18T12:00:00.000Z");
  const tx = {
    invoice: {
      findFirst: async ({ where }: { where: Record<string, unknown> }) => {
        assert.deepEqual(where, {
          id: "invoice-a",
          organizationId: "tenant-a",
        });
        return {
          status: "DRAFT",
          version: 3,
          approvedAt,
          approvedByMembershipId: "approver-a",
        };
      },
      updateMany: async ({ where }: { where: Record<string, unknown> }) => {
        assert.deepEqual(where, {
          id: "invoice-a",
          organizationId: "tenant-a",
          version: 3,
          status: "DRAFT",
          approvedAt,
          approvedByMembershipId: "approver-a",
        });
        return { count: 0 };
      },
    },
    auditEvent: {
      create: async () => {
        audits++;
      },
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(transitionInvoiceTx(tx, command), /changed after/);
  assert.equal(audits, 0);
});
test("a repeated command creates neither duplicate audit nor mutation", async () => {
  let writes = 0;
  const tx = {
    invoice: {
      findFirst: async () => ({
        status: "OPEN",
        version: 4,
        approvedAt: new Date(),
        approvedByMembershipId: "approver-a",
      }),
      updateMany: async () => {
        writes++;
        return { count: 1 };
      },
    },
    auditEvent: {
      create: async () => {
        writes++;
      },
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(transitionInvoiceTx(tx, command), /changed after/);
  assert.equal(writes, 0);
});
test("cross-tenant record absence creates no financial side effects", async () => {
  let writes = 0;
  const tx = {
    invoice: {
      findFirst: async () => null,
      updateMany: async () => {
        writes++;
        return { count: 1 };
      },
    },
    auditEvent: {
      create: async () => {
        writes++;
      },
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(transitionInvoiceTx(tx, command), /not found/);
  assert.equal(writes, 0);
});
