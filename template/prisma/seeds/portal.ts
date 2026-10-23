import type { SeedContext } from "@/prisma/seeds/base";
import { seedIds as uploadsSeedIds } from "@/prisma/seeds/uploads";

export const seedIds = {
  portalDocument: "00000000-0000-4000-8000-000000000100",
  portalVersion: "00000000-0000-4000-8000-000000000101",
  portalApproval: "00000000-0000-4000-8000-000000000102",
} as const;

export async function seed({
  tx,
  organization,
  ownerMembership,
}: SeedContext): Promise<void> {
  const document = await tx.portalDocument.upsert({
    where: {
      id: seedIds.portalDocument,
    },
    update: {
      organizationId: organization.id,
      title: "Implementation Plan",
      description: "Seed portal document.",
      status: "IN_REVIEW",
      clientVisible: true,
      currentVersionNumber: 1,
    },
    create: {
      id: seedIds.portalDocument,
      organizationId: organization.id,
      title: "Implementation Plan",
      description: "Seed portal document.",
      status: "IN_REVIEW",
      clientVisible: true,
      currentVersionNumber: 1,
    },
  });

  const documentVersion = await tx.portalDocumentVersion.upsert({
    where: {
      id: seedIds.portalVersion,
    },
    update: {
      organizationId: organization.id,
      documentId: document.id,
      assetId: uploadsSeedIds.asset,
      uploadedByMembershipId: ownerMembership.id,
      versionNumber: 1,
      notes: "Initial version",
    },
    create: {
      id: seedIds.portalVersion,
      organizationId: organization.id,
      documentId: document.id,
      assetId: uploadsSeedIds.asset,
      uploadedByMembershipId: ownerMembership.id,
      versionNumber: 1,
      notes: "Initial version",
    },
  });

  await tx.portalApproval.upsert({
    where: {
      id: seedIds.portalApproval,
    },
    update: {
      organizationId: organization.id,
      documentVersionId: documentVersion.id,
      reviewerMembershipId: ownerMembership.id,
      reviewerLabel: "Maximal Owner",
      status: "PENDING",
    },
    create: {
      id: seedIds.portalApproval,
      organizationId: organization.id,
      documentVersionId: documentVersion.id,
      reviewerMembershipId: ownerMembership.id,
      reviewerLabel: "Maximal Owner",
      status: "PENDING",
    },
  });
}
