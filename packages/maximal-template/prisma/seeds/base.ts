/**
 * Base seed data and the context module seeds receive. Each owner seeds its own
 * tables in `prisma/seeds/<owner>.ts` (`seed(context)`); prisma/seed.ts runs
 * them in dependency order inside one transaction, so a composed app seeds
 * exactly the modules it has.
 */
import { seedAuth } from "@/prisma/seeds/auth";
import { authSeedIds } from "@/lib/constants/authConstants";
import { seedAuthz } from "@/prisma/seeds/authz";
import { authzSeedIds } from "@/lib/constants/authzConstants";
import type { Prisma } from "@/generated/prisma/client";

/** Stable fixture identifiers shared across identity and domain seed data. */
export const seedIds = {
  ...authzSeedIds,
  ...authSeedIds,
  auditEvent: "00000000-0000-4000-8000-000000000110",
} as const;

/** Seed transaction and fixture identities supplied to domain seed functions. */
export type SeedContext = {
  tx: Prisma.TransactionClient;
  owner: { id: string };
  agent: { id: string };
  organization: { id: string };
  ownerMembership: { id: string };
  agentMembership: { id: string };
};

/** Seed identity fixtures and delegate organization fixtures to the authorization owner. */
export async function seedBase(
  tx: Prisma.TransactionClient,
): Promise<SeedContext> {
  const { owner, agent } = await seedAuth(tx);

  const { organization, ownerMembership, agentMembership } = await seedAuthz({
    tx,
    owner,
    agent,
  });

  return { tx, owner, agent, organization, ownerMembership, agentMembership };
}

/** Records which owners were seeded (base audit trail). */
export async function seedAudit(
  { tx, owner, organization }: SeedContext,
  seeded: readonly string[],
): Promise<void> {
  await tx.auditEvent.upsert({
    where: {
      id: seedIds.auditEvent,
    },
    update: {
      organizationId: organization.id,
      actorUserId: owner.id,
      action: "seed.completed",
      resourceType: "Organization",
      resourceId: organization.id,
      metadata: {
        recipes: [...seeded],
      },
    },
    create: {
      id: seedIds.auditEvent,
      organizationId: organization.id,
      actorUserId: owner.id,
      action: "seed.completed",
      resourceType: "Organization",
      resourceId: organization.id,
      metadata: {
        recipes: [...seeded],
      },
    },
  });
}
