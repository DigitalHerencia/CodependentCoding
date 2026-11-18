/** Organization and membership fixtures, seeded after the base identities. */
import { authzSeedIds as seedIds } from "@/lib/constants/authzConstants";
import { setRlsContext } from "@/lib/db/rls";
import type { AuthzSeedIdentityContext } from "@/types/authzTypes";

/** Seed authorization fixtures under the explicit owning-user and organization context. */
export async function seedAuthz({
  tx,
  owner,
  agent,
}: AuthzSeedIdentityContext) {
  await setRlsContext(tx, {
    userId: owner.id,
    organizationId: seedIds.organization,
  });
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

  await setRlsContext(tx, { organizationId: organization.id });

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
      role: "MEMBER",
      status: "ACTIVE",
    },
    create: {
      id: seedIds.agentMembership,
      organizationId: organization.id,
      userId: agent.id,
      role: "MEMBER",
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

  return { organization, ownerMembership, agentMembership };
}
