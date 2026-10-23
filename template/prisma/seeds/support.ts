import type { SeedContext } from "@/prisma/seeds/base";

export const seedIds = {
  supportTicket: "00000000-0000-4000-8000-000000000050",
  supportMessage: "00000000-0000-4000-8000-000000000051",
  knowledgeArticle: "00000000-0000-4000-8000-000000000052",
} as const;

export async function seed({
  tx,
  owner,
  organization,
  agentMembership,
}: SeedContext): Promise<void> {
  const ticket = await tx.supportTicket.upsert({
    where: {
      id: seedIds.supportTicket,
    },
    update: {
      organizationId: organization.id,
      requesterUserId: owner.id,
      assignedMembershipId: agentMembership.id,
      number: 1,
      subject: "Example support request",
      description: "Seed ticket exercising support ownership and assignment.",
      status: "IN_PROGRESS",
      priority: "NORMAL",
    },
    create: {
      id: seedIds.supportTicket,
      organizationId: organization.id,
      requesterUserId: owner.id,
      assignedMembershipId: agentMembership.id,
      number: 1,
      subject: "Example support request",
      description: "Seed ticket exercising support ownership and assignment.",
      status: "IN_PROGRESS",
      priority: "NORMAL",
    },
  });

  await tx.supportMessage.upsert({
    where: {
      id: seedIds.supportMessage,
    },
    update: {
      organizationId: organization.id,
      ticketId: ticket.id,
      authorMembershipId: agentMembership.id,
      authorLabel: "Maximal Agent",
      body: "We are looking into this.",
      isInternal: false,
    },
    create: {
      id: seedIds.supportMessage,
      organizationId: organization.id,
      ticketId: ticket.id,
      authorMembershipId: agentMembership.id,
      authorLabel: "Maximal Agent",
      body: "We are looking into this.",
      isInternal: false,
    },
  });

  await tx.knowledgeArticle.upsert({
    where: {
      id: seedIds.knowledgeArticle,
    },
    update: {
      organizationId: organization.id,
      authorMembershipId: agentMembership.id,
      slug: "getting-started",
      title: "Getting Started",
      body: "Welcome to the maximal template.",
      status: "PUBLISHED",
      publishedAt: new Date("2026-08-01T12:00:00.000Z"),
    },
    create: {
      id: seedIds.knowledgeArticle,
      organizationId: organization.id,
      authorMembershipId: agentMembership.id,
      slug: "getting-started",
      title: "Getting Started",
      body: "Welcome to the maximal template.",
      status: "PUBLISHED",
      publishedAt: new Date("2026-08-01T12:00:00.000Z"),
    },
  });
}
