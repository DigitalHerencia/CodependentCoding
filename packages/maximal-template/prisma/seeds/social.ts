import type { SeedContext } from "@/prisma/seeds/base";
import { seedIds as uploadsSeedIds } from "@/prisma/seeds/uploads";

export const seedIds = {
  socialAccount: "00000000-0000-4000-8000-000000000080",
  socialPost: "00000000-0000-4000-8000-000000000081",
  socialVariant: "00000000-0000-4000-8000-000000000082",
  socialMedia: "00000000-0000-4000-8000-000000000083",
} as const;

export async function seed({
  tx,
  organization,
  ownerMembership,
}: SeedContext): Promise<void> {
  const socialAccount = await tx.socialAccount.upsert({
    where: {
      id: seedIds.socialAccount,
    },
    update: {
      organizationId: organization.id,
      provider: "LINKEDIN",
      providerAccountId: "seed-linkedin-account",
      displayName: "Maximal Template",
      credentialRef: null,
      active: true,
    },
    create: {
      id: seedIds.socialAccount,
      organizationId: organization.id,
      provider: "LINKEDIN",
      providerAccountId: "seed-linkedin-account",
      displayName: "Maximal Template",
      credentialRef: null,
      active: true,
    },
  });

  const socialPost = await tx.socialPost.upsert({
    where: {
      id: seedIds.socialPost,
    },
    update: {
      organizationId: organization.id,
      createdByMembershipId: ownerMembership.id,
      title: "Launch",
      content: "The Maximal Template is coming.",
      status: "SCHEDULED",
      scheduledAt: new Date("2026-09-01T18:00:00.000Z"),
    },
    create: {
      id: seedIds.socialPost,
      organizationId: organization.id,
      createdByMembershipId: ownerMembership.id,
      title: "Launch",
      content: "The Maximal Template is coming.",
      status: "SCHEDULED",
      scheduledAt: new Date("2026-09-01T18:00:00.000Z"),
    },
  });

  await tx.socialVariant.upsert({
    where: {
      id: seedIds.socialVariant,
    },
    update: {
      organizationId: organization.id,
      postId: socialPost.id,
      socialAccountId: socialAccount.id,
      content: "The Maximal Template is coming.",
      status: "SCHEDULED",
    },
    create: {
      id: seedIds.socialVariant,
      organizationId: organization.id,
      postId: socialPost.id,
      socialAccountId: socialAccount.id,
      content: "The Maximal Template is coming.",
      status: "SCHEDULED",
    },
  });

  await tx.socialPostMedia.upsert({
    where: {
      id: seedIds.socialMedia,
    },
    update: {
      organizationId: organization.id,
      postId: socialPost.id,
      assetId: uploadsSeedIds.asset,
      position: 1,
    },
    create: {
      id: seedIds.socialMedia,
      organizationId: organization.id,
      postId: socialPost.id,
      assetId: uploadsSeedIds.asset,
      position: 1,
    },
  });
}
