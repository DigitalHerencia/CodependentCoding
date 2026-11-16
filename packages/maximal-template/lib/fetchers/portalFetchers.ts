import {
  persistedReadLimitSchema,
  persistedRecordIdSchema,
} from "@/schemas/commonSchemas";
import "server-only";

import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import { limitedToCustomerRecords } from "@/lib/authz/attributes";
import {
  toPortalBillingSubscriptionDTO,
  toPortalDocumentDTO,
  toPortalInvoiceDTO,
} from "@/lib/db/dtos/portalDtos";
import {
  portalBillingSelect,
  portalDocumentSelect,
  portalInvoiceSelect,
} from "@/lib/db/selects/portalSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getPortalDocuments(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "portal.document:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);

    // No customer-recipient relationship exists in PortalDocument yet.
    if (limitedToCustomerRecords(access)) return [];

    const rows = await tx.portalDocument.findMany({
      where: {
        organizationId: access.organizationId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: Math.min(Math.max(limit, 1), 200),
      select: portalDocumentSelect,
    });

    return rows.map(toPortalDocumentDTO);
  });
}

export async function getPortalBilling() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "portal.billing:read");
    // Invoice customerName/email and tenant subscription are not authenticated recipients.
    if (limitedToCustomerRecords(access)) return { subscription: null, invoices: [] };
    const [subscription, invoices] = await Promise.all([
      tx.billingSubscription.findUnique({
        where: { organizationId: access.organizationId },
        select: portalBillingSelect,
      }),
      tx.invoice.findMany({
        where: { organizationId: access.organizationId },
        orderBy: { createdAt: "desc" },
        take: 25,
        select: portalInvoiceSelect,
      }),
    ]);
    return {
      subscription: subscription
        ? toPortalBillingSubscriptionDTO(subscription)
        : null,
      invoices: invoices.map(toPortalInvoiceDTO),
    };
  });
}

export async function getPortalWriteAccess() {
  return withAuthenticatedRead(async (_tx, access) => {
    return hasPermission(access, "portal.document:create");
  });
}

export async function getPortalAssets() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "portal.document:create");
    return tx.asset.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, filename: true },
    });
  });
}

export async function getPortalDocument(rawDocumentId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "portal.document:read");
    const documentId = persistedRecordIdSchema.parse(rawDocumentId);
    if (limitedToCustomerRecords(access)) return null;
    const row = await tx.portalDocument.findFirst({
      where: {
        id: documentId,
        organizationId: access.organizationId,
      },
      select: portalDocumentSelect,
    });
    return row ? toPortalDocumentDTO(row) : null;
  });
}
