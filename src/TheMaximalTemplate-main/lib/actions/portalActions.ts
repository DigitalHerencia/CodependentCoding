"use server";

import {
  addPortalDocumentVersionSchema,
  createPortalDocumentSchema,
} from "../../schemas/portalSchemas";

import { requireIdentity } from "../auth/identity";
import { assertPermission } from "../authz/permissions";
import { toPortalDocumentDTO } from "../db/dto/portal.dto";
import { portalDocumentSelect } from "../db/selects/portal.selects";
import { withTenantTransaction } from "../db/tenant";
import { addPortalVersionTx } from "../db/transactions/add-portal-version.tx";

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
      notes: input.notes,
      expectedVersion: input.expectedVersion,
    });

    return toPortalDocumentDTO(record);
  });
}
