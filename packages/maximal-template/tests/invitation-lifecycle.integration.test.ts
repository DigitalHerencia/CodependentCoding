import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import { baseEnv } from "@/lib/utils/env";
import { tenancy } from "@/lib/authz/mode";
import { setRlsContext } from "@/lib/db/rls";
import {
  acceptInvitationTx,
  hashInvitationToken,
} from "@/lib/db/transactions/invitationTx";

config({ path: ".env.local", quiet: true });

// Authored only. Requires a separately prepared, disposable, multi-tenant database.
// No migration/seed command is started, and every fixture write rolls back.
test.skipIf(!baseEnv.value("DATABASE_URL_TEST") || tenancy !== "multi")(
  "joining B retains A, accepts a token once, and cannot reactivate a suspended membership",
  async () => {
    const connectionString = baseEnv.value("DATABASE_URL_TEST");
    if (!connectionString)
      throw new Error("A disposable DATABASE_URL_TEST is required.");
    const prisma = new PrismaClient({
      adapter: new PrismaNeon({ connectionString }),
    });
    const rollback = new Error("intentional fixture rollback");
    try {
      await expect(
        prisma.$transaction(
          async (tx) => {
            const userId = `user_invitation_fixture_${randomUUID()}`;
            const orgA = randomUUID();
            const orgB = randomUUID();
            await setRlsContext(tx, { clerkUserId: userId, userId });
            await tx.user.create({
              data: {
                id: userId,
                email: "invitation-fixture@example.test",
                profileCompletedAt: new Date(),
              },
            });
            await setRlsContext(tx, { organizationId: orgA });
            await tx.organization.create({
              data: { id: orgA, name: "Fixture A", slug: `fixture-a-${orgA}` },
            });
            await tx.membership.create({
              data: {
                organizationId: orgA,
                userId,
                role: "MEMBER",
                status: "ACTIVE",
              },
            });
            await setRlsContext(tx, { organizationId: orgB });
            await tx.organization.create({
              data: { id: orgB, name: "Fixture B", slug: `fixture-b-${orgB}` },
            });
            const invitation = await tx.invitation.create({
              data: {
                organizationId: orgB,
                email: "invitation-fixture@example.test",
                role: "VIEWER",
                tokenHash: hashInvitationToken(randomUUID()),
                invitedByUserId: userId,
                expiresAt: new Date(Date.now() + 60_000),
              },
              select: { id: true, organizationId: true, role: true },
            });
            const first = await acceptInvitationTx(tx, invitation, userId);
            const replay = await acceptInvitationTx(tx, invitation, userId);
            expect(replay).toEqual(first);
            expect(
              await tx.membership.count({
                where: { organizationId: orgB, userId },
              }),
            ).toBe(1);
            await setRlsContext(tx, { organizationId: orgA });
            expect(
              await tx.membership.findFirst({
                where: {
                  organizationId: orgA,
                  userId,
                  role: "MEMBER",
                  status: "ACTIVE",
                },
              }),
            ).not.toBeNull();
            await setRlsContext(tx, { organizationId: orgB });
            await tx.membership.update({
              where: { id: first.membershipId },
              data: { status: "SUSPENDED" },
            });
            await expect(
              acceptInvitationTx(tx, invitation, userId),
            ).rejects.toThrow();
            expect(
              await tx.membership.findUnique({
                where: { id: first.membershipId },
                select: { status: true },
              }),
            ).toEqual({ status: "SUSPENDED" });
            throw rollback;
          },
          { timeout: 30_000 },
        ),
      ).rejects.toBe(rollback);
    } finally {
      await prisma.$disconnect();
    }
  },
);
