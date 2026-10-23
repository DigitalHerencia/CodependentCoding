import { Prisma } from "@/generated/prisma/client";
import type { SeedContext } from "@/prisma/seeds/base";

export const seedIds = {
  crmAccount: "00000000-0000-4000-8000-000000000030",
  crmContact: "00000000-0000-4000-8000-000000000031",
  crmDeal: "00000000-0000-4000-8000-000000000032",
} as const;

export async function seed({
  tx,
  organization,
  ownerMembership,
}: SeedContext): Promise<void> {
  const crmAccount = await tx.crmAccount.upsert({
    where: {
      id: seedIds.crmAccount,
    },
    update: {
      organizationId: organization.id,
      ownerMembershipId: ownerMembership.id,
      name: "Acme Client",
      website: "https://example.test",
      industry: "Software",
      status: "ACTIVE",
    },
    create: {
      id: seedIds.crmAccount,
      organizationId: organization.id,
      ownerMembershipId: ownerMembership.id,
      name: "Acme Client",
      website: "https://example.test",
      industry: "Software",
      status: "ACTIVE",
    },
  });

  const crmContact = await tx.crmContact.upsert({
    where: {
      id: seedIds.crmContact,
    },
    update: {
      organizationId: organization.id,
      accountId: crmAccount.id,
      ownerMembershipId: ownerMembership.id,
      firstName: "Alex",
      lastName: "Customer",
      email: "alex@example.test",
      title: "Operations Director",
      status: "ACTIVE",
    },
    create: {
      id: seedIds.crmContact,
      organizationId: organization.id,
      accountId: crmAccount.id,
      ownerMembershipId: ownerMembership.id,
      firstName: "Alex",
      lastName: "Customer",
      email: "alex@example.test",
      title: "Operations Director",
      status: "ACTIVE",
    },
  });

  await tx.crmDeal.upsert({
    where: {
      id: seedIds.crmDeal,
    },
    update: {
      organizationId: organization.id,
      accountId: crmAccount.id,
      primaryContactId: crmContact.id,
      ownerMembershipId: ownerMembership.id,
      name: "Maximal Template Pilot",
      stage: "PROPOSAL",
      value: new Prisma.Decimal("25000.00"),
      currency: "USD",
      probability: 65,
      expectedCloseDate: new Date("2026-09-30T00:00:00.000Z"),
    },
    create: {
      id: seedIds.crmDeal,
      organizationId: organization.id,
      accountId: crmAccount.id,
      primaryContactId: crmContact.id,
      ownerMembershipId: ownerMembership.id,
      name: "Maximal Template Pilot",
      stage: "PROPOSAL",
      value: new Prisma.Decimal("25000.00"),
      currency: "USD",
      probability: 65,
      expectedCloseDate: new Date("2026-09-30T00:00:00.000Z"),
    },
  });
}
