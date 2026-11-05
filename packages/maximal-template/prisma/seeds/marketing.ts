import type { SeedContext } from "@/prisma/seeds/base";

export const seedIds = {
  audience: "00000000-0000-4000-8000-000000000060",
  campaign: "00000000-0000-4000-8000-000000000061",
  campaignStep: "00000000-0000-4000-8000-000000000062",
} as const;

export async function seed({
  tx,
  organization,
  ownerMembership,
}: SeedContext): Promise<void> {
  const audience = await tx.audience.upsert({
    where: {
      id: seedIds.audience,
    },
    update: {
      organizationId: organization.id,
      name: "Active Customers",
      definition: {
        operator: "and",
        rules: [
          {
            field: "status",
            operator: "equals",
            value: "active",
          },
        ],
      },
      status: "ACTIVE",
    },
    create: {
      id: seedIds.audience,
      organizationId: organization.id,
      name: "Active Customers",
      definition: {
        operator: "and",
        rules: [
          {
            field: "status",
            operator: "equals",
            value: "active",
          },
        ],
      },
      status: "ACTIVE",
    },
  });

  const campaign = await tx.campaign.upsert({
    where: {
      id: seedIds.campaign,
    },
    update: {
      organizationId: organization.id,
      audienceId: audience.id,
      ownerMembershipId: ownerMembership.id,
      name: "Maximal Launch",
      description: "Seed marketing campaign.",
      status: "DRAFT",
    },
    create: {
      id: seedIds.campaign,
      organizationId: organization.id,
      audienceId: audience.id,
      ownerMembershipId: ownerMembership.id,
      name: "Maximal Launch",
      description: "Seed marketing campaign.",
      status: "DRAFT",
    },
  });

  await tx.campaignStep.upsert({
    where: {
      id: seedIds.campaignStep,
    },
    update: {
      organizationId: organization.id,
      campaignId: campaign.id,
      position: 1,
      type: "EMAIL",
      config: {
        templateKey: "maximal-launch",
      },
    },
    create: {
      id: seedIds.campaignStep,
      organizationId: organization.id,
      campaignId: campaign.id,
      position: 1,
      type: "EMAIL",
      config: {
        templateKey: "maximal-launch",
      },
    },
  });
}
