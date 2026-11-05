"use server";

import {
  portalDocumentCommandSchema,
  addPortalDocumentVersionSchema,
  createPortalDocumentSchema,
} from "@/schema/portalSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { limitedToOwnRecords } from "@/lib/authz/policies";
import { toPortalDocumentDTO } from "@/lib/db/dtos/portalDtos";
import { portalDocumentSelect } from "@/lib/db/selects/portalSelects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { readPrivateBlob } from "@/lib/integrations/vercel-blob/download";
import { sharePortalDocumentTx } from "@/lib/db/transactions/portalTx";
import { addPortalVersionTx } from "@/lib/db/transactions/portalAddVersionTx";

export async function createPortalDocument(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal.document:create");
    const input = createPortalDocumentSchema.parse(rawInput);
    const record = await tx.portalDocument.create({
      data: {
        organizationId: access.organizationId,
        title: input.title,
        description: input.description ?? null,
        clientVisible: input.clientVisible,
      },
      select: portalDocumentSelect,
    });
    return toPortalDocumentDTO(record);
  });
}

export async function addPortalDocumentVersion(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal.document:update");
    const input = addPortalDocumentVersionSchema.parse(rawInput);
    const record = await addPortalVersionTx(tx, {
      organizationId: access.organizationId,
      membershipId: access.membershipId,
      documentId: input.documentId,
      assetId: input.assetId,
      notes: input.notes ?? null,
      expectedVersion: input.expectedVersion,
    });
    return toPortalDocumentDTO(record);
  });
}

export async function sharePortalDocument(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal.document:update");
    const input = portalDocumentCommandSchema.parse(rawInput);
    return toPortalDocumentDTO(
      await sharePortalDocumentTx(tx, {
        ...input,
        organizationId: access.organizationId,
      }),
    );
  });
}
export async function downloadPortalDocument(rawInput: unknown) {
  const identity = await requireIdentity();
  const asset = await withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal.document:read");
    const { documentId } = portalDocumentCommandSchema
      .pick({ documentId: true })
      .parse(rawInput);
    const document = await tx.portalDocument.findFirst({
      where: {
        id: documentId,
        organizationId: access.organizationId,
        ...(limitedToOwnRecords(access)
          ? { clientVisible: true, status: { not: "ARCHIVED" as const } }
          : {}),
      },
      select: {
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          select: {
            asset: {
              select: {
                storageProvider: true,
                storageKey: true,
                filename: true,
                byteSize: true,
              },
            },
          },
        },
      },
    });
    const asset = document?.versions[0]?.asset;
    if (!asset) throw new Error("File not found.");
    if (asset.storageProvider !== "vercel-blob" || asset.byteSize > 10485760n)
      throw new Error("This file cannot be downloaded through this workspace.");
    return asset;
  });
  return {
    filename: asset.filename,
    base64: await readPrivateBlob(asset.storageKey),
  };
}
