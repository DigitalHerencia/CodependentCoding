/** Clerk identity fixtures and explicitly completed nullable local profile data. */
import type { Prisma } from "@/generated/prisma/client";
import { authSeedIds } from "@/lib/constants/authConstants";
import { setRlsContext } from "@/lib/db/rls";

/** Create deterministic identities before authorization fixtures consume them. */
export async function seedAuth(tx: Prisma.TransactionClient) {
  await setRlsContext(tx, { clerkUserId: authSeedIds.ownerUser });
  const ownerProfile = {
    email: "owner@example.test",
    username: "maximal_owner",
    displayName: "Maximal Owner",
    firstName: "Maximal",
    lastName: "Owner",
    bio: null,
    phoneNumber: null,
    profileCompletedAt: new Date("2026-01-01T00:00:00Z"),
  };
  const owner = await tx.user.upsert({
    where: { id: authSeedIds.ownerUser },
    update: ownerProfile,
    create: { id: authSeedIds.ownerUser, ...ownerProfile },
    select: { id: true },
  });
  await setRlsContext(tx, { clerkUserId: authSeedIds.agentUser });
  const agentProfile = {
    email: "agent@example.test",
    username: "maximal_agent",
    displayName: "Maximal Agent",
    firstName: "Maximal",
    lastName: "Agent",
    bio: null,
    phoneNumber: null,
    profileCompletedAt: new Date("2026-01-01T00:00:00Z"),
  };
  const agent = await tx.user.upsert({
    where: { id: authSeedIds.agentUser },
    update: agentProfile,
    create: { id: authSeedIds.agentUser, ...agentProfile },
    select: { id: true },
  });
  await setRlsContext(tx, { clerkUserId: owner.id, userId: owner.id });
  return { owner, agent };
}
