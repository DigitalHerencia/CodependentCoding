"use server";

import {
  addPortalDocumentVersionSchema,
  createPortalDocumentSchema,
} from "@/schemas/portalSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toPortalDocumentDTO } from "@/lib/db/dto/portal.dto";
import { portalDocumentSelect } from "@/lib/db/selects/portal.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { addPortalVersionTx } from "@/lib/db/transactions/add-portal-version.tx";

export async function createPortalDocument(rawInput: unknown) {
  const input = createPortalDocumentSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal:write");
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
  const input = addPortalDocumentVersionSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal:write");
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
