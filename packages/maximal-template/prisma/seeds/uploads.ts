import type { SeedContext } from "@/prisma/seeds/base";

export const seedIds = {
  asset: "00000000-0000-4000-8000-000000000020",
} as const;

export async function seed({
  tx,
  organization,
  ownerMembership,
}: SeedContext): Promise<void> {
  await tx.asset.upsert({
    where: {
      id: seedIds.asset,
    },
    update: {
      organizationId: organization.id,
      createdByMembershipId: ownerMembership.id,
      storageProvider: "seed",
      storageKey: "documents/maximal-template.pdf",
      filename: "maximal-template.pdf",
      contentType: "application/pdf",
      byteSize: BigInt(65_536),
      checksum: "seed-checksum",
    },
    create: {
      id: seedIds.asset,
      organizationId: organization.id,
      createdByMembershipId: ownerMembership.id,
      storageProvider: "seed",
      storageKey: "documents/maximal-template.pdf",
      filename: "maximal-template.pdf",
      contentType: "application/pdf",
      byteSize: BigInt(65_536),
      checksum: "seed-checksum",
    },
  });
}
