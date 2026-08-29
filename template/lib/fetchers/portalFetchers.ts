import "server-only";

import { assertPermission } from "../authz/permissions";
import { toPortalDocumentDTO } from "../db/dto/portal.dto";
import { portalDocumentSelect } from "../db/selects/portal.selects";
import {
  portalBillingSelect,
  portalInvoiceSelect,
} from "../db/selects/portal.selects";
import { withTemplateReadTransaction } from "../db/tenant";

export async function getPortalDocuments(limit = 100) {
  return withTemplateReadTransaction(async (tx, access) => {
    assertPermission(access, "portal:read");

    const clientOnly = access.role === "CLIENT";

    const rows = await tx.portalDocument.findMany({
      where: {
        organizationId: access.organizationId,
        ...(clientOnly
          ? {
              clientVisible: true,
              status: {
                not: "ARCHIVED",
              },
            }
          : {}),
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
  return withTemplateReadTransaction(async (tx, access) => {
    assertPermission(access, "portal:billing");
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
        ? {
            ...subscription,
            currentPeriodEnd:
              subscription.currentPeriodEnd?.toISOString() ?? null,
          }
        : null,
      invoices: invoices.map((invoice) => ({
        ...invoice,
        total: invoice.total.toString(),
        dueAt: invoice.dueAt?.toISOString() ?? null,
      })),
    };
  });
}
