/**
 * Base seed data and the context module seeds receive. Each owner seeds its own
 * tables in `prisma/seeds/<owner>.ts` (`seed(context)`); prisma/seed.ts runs
 * them in dependency order inside one transaction, so a composed app seeds
 * exactly the modules it has.
 */
import type { Prisma } from "@/generated/prisma/client";

export const seedIds = {
  ownerUser: "00000000-0000-4000-8000-000000000001",
  agentUser: "00000000-0000-4000-8000-000000000002",
  organization: "00000000-0000-4000-8000-000000000010",
  ownerMembership: "00000000-0000-4000-8000-000000000011",
  agentMembership: "00000000-0000-4000-8000-000000000012",
  settings: "00000000-0000-4000-8000-000000000013",
  auditEvent: "00000000-0000-4000-8000-000000000110",
} as const;

const clerk = {
  ownerUser: "user_seed_owner",
  agentUser: "user_seed_agent",
} as const;

export interface SeedContext {
  tx: Prisma.TransactionClient;
  owner: { id: string };
  agent: { id: string };
  organization: { id: string };
  ownerMembership: { id: string };
  agentMembership: { id: string };
}

async function setConfig(
  tx: Prisma.TransactionClient,
  key: string,
  value: string,
): Promise<void> {
  await tx.$queryRaw`
    SELECT set_config(${key}, ${value}, true)
  `;
}

export async function seedBase(
  tx: Prisma.TransactionClient,
): Promise<SeedContext> {
  await setConfig(tx, "app.clerk_user_id", clerk.ownerUser);

  const owner = await tx.user.upsert({
    where: {
      id: seedIds.ownerUser,
    },
    update: {
      clerkUserId: clerk.ownerUser,
      email: "owner@example.test",
      displayName: "Maximal Owner",
    },
    create: {
      id: seedIds.ownerUser,
      clerkUserId: clerk.ownerUser,
      email: "owner@example.test",
      displayName: "Maximal Owner",
    },
  });

  await setConfig(tx, "app.clerk_user_id", clerk.agentUser);

  const agent = await tx.user.upsert({
    where: {
      id: seedIds.agentUser,
    },
    update: {
      clerkUserId: clerk.agentUser,
      email: "agent@example.test",
      displayName: "Maximal Agent",
    },
    create: {
      id: seedIds.agentUser,
      clerkUserId: clerk.agentUser,
      email: "agent@example.test",
      displayName: "Maximal Agent",
    },
  });

  await setConfig(tx, "app.clerk_user_id", clerk.ownerUser);

  const organization = await tx.organization.upsert({
    where: {
      id: seedIds.organization,
    },
    update: {
      slug: "maximal-template",
      name: "The Maximal Template",
    },
    create: {
      id: seedIds.organization,
      slug: "maximal-template",
      name: "The Maximal Template",
    },
  });

  await setConfig(tx, "app.organization_id", organization.id);

  const ownerMembership = await tx.membership.upsert({
    where: {
      id: seedIds.ownerMembership,
    },
    update: {
      organizationId: organization.id,
      userId: owner.id,
      role: "OWNER",
      status: "ACTIVE",
    },
    create: {
      id: seedIds.ownerMembership,
      organizationId: organization.id,
      userId: owner.id,
      role: "OWNER",
      status: "ACTIVE",
    },
  });

  const agentMembership = await tx.membership.upsert({
    where: {
      id: seedIds.agentMembership,
    },
    update: {
      organizationId: organization.id,
      userId: agent.id,
      role: "SUPPORT",
      status: "ACTIVE",
    },
    create: {
      id: seedIds.agentMembership,
      organizationId: organization.id,
      userId: agent.id,
      role: "SUPPORT",
      status: "ACTIVE",
    },
  });

  await tx.organizationSettings.upsert({
    where: {
      id: seedIds.settings,
    },
    update: {
      organizationId: organization.id,
      timezone: "America/Phoenix",
      locale: "en-US",
      defaultCurrency: "USD",
    },
    create: {
      id: seedIds.settings,
      organizationId: organization.id,
      timezone: "America/Phoenix",
      locale: "en-US",
      defaultCurrency: "USD",
    },
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
