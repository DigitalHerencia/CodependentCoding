import {
  createInvoiceSchema,
  updateInvoiceStatusSchema,
} from "../../schemas/invoicingSchemas";

import { requireIdentity } from "../auth/auth";
import { assertPermission } from "../authz/permissions";
import { toInvoiceDTO } from "../db/dto/invoicing.dto";
import { withTenantTransaction } from "../db/tenant";
import { createInvoiceTx } from "../db/transactions/create-invoice.tx";
import { updateInvoiceStatusTx } from "../db/transactions/update-invoice-status.tx";

export async function createInvoiceWorkflow(rawInput: unknown) {
  const input = createInvoiceSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing:write");

    const record = await createInvoiceTx(tx, {
      organizationId: access.organizationId,
      createdByMembershipId: access.membershipId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      currency: input.currency,
      issuedAt: input.issuedAt,
      dueAt: input.dueAt,
      lines: input.lines,
    });

    await tx.auditEvent.create({
      data: {
        organizationId: access.organizationId,
        actorUserId: access.userId,
        action: "invoice.created",
        resourceType: "Invoice",
        resourceId: record.id,
        metadata: {
          number: record.number,
          total: record.total.toString(),
          currency: record.currency,
        },
      },
    });

    return toInvoiceDTO(record);
  });
}

export async function updateInvoiceStatusWorkflow(rawInput: unknown) {
  const input = updateInvoiceStatusSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing:write");

    const record = await updateInvoiceStatusTx(tx, {
      organizationId: access.organizationId,
      invoiceId: input.invoiceId,
      status: input.status,
      expectedVersion: input.expectedVersion,
    });

    return toInvoiceDTO(record);
  });
}
