"use server";
/** Invoicing Actions contracts and composition for the owning application slice. */
import { toActionResult } from "@/lib/utils/actionResult";

import {
  updateInvoiceSchema,
  expenseFormSchema,
  updateExpenseSchema,
  createInvoiceSchema,
  updateInvoiceStatusSchema,
} from "@/schemas/invoicingSchemas";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { toExpenseDTO, toInvoiceDTO } from "@/lib/db/dtos/invoicingDtos";
import { withTenantTransaction } from "@/lib/db/tenancy";
import {
  createInvoiceTx,
  submitExpenseTx,
  transitionInvoiceTx,
  updateInvoiceTx,
  updateExpenseTx,
} from "@/lib/db/selects/invoicingTx";
import { InvariantViolationError } from "@/lib/db/transactions/errors";
import { invoiceCommandSchema } from "@/schemas/invoicingSchemas";

/** Create a tenant-numbered draft and its audit event in one authorized transaction. */
export async function createInvoice(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "invoicing.invoice:create");
      const input = createInvoiceSchema.parse(rawInput);
      const record = await createInvoiceTx(tx, {
        organizationId: access.organizationId,
        createdByMembershipId: access.membershipId,
        actorUserId: access.userId,
        customerName: input.customerName,
        customerEmail: input.customerEmail ?? null,
        currency: input.currency,
        issuedAt: input.issuedAt
          ? new Date(`${input.issuedAt}T00:00:00.000Z`)
          : null,
        dueAt: input.dueAt ? new Date(`${input.dueAt}T00:00:00.000Z`) : null,
        lines: input.lines,
      });
      return toInvoiceDTO(record);
    });
  });
}

/** Reject terminal status requests until the owner records the supported financial policy. */
export async function updateInvoiceStatus(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (_tx, access) => {
      assertPermission(access, "invoicing.invoice:update");
      updateInvoiceStatusSchema.parse(rawInput);
      // OPEN/OVERDUE -> PAID/VOID awaits an owner policy decision; history stays intact.
      throw new InvariantViolationError(
        "Invoice status changes require an approved transition policy.",
      );
    });
  });
}

/** Replace current unapproved draft lines and exact header totals atomically. */
export async function updateInvoice(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "invoicing.invoice:update");
      const input = updateInvoiceSchema.parse(rawInput);
      return toInvoiceDTO(
        await updateInvoiceTx(tx, {
          ...input,
          customerEmail: input.customerEmail ?? null,
          organizationId: access.organizationId,
          actorUserId: access.userId,
          issuedAt: input.issuedAt
            ? new Date(`${input.issuedAt}T00:00:00.000Z`)
            : null,
          dueAt: input.dueAt ? new Date(`${input.dueAt}T00:00:00.000Z`) : null,
        }),
      );
    });
  });
}
/** Submit a positive expense and its audit under the current tenant authority. */
export async function createExpense(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "invoicing.expense:create");
      const input = expenseFormSchema.parse(rawInput);
      return toExpenseDTO(
        await submitExpenseTx(tx, {
          ...input,
          incurredAt: new Date(`${input.incurredAt}T00:00:00.000Z`),
          organizationId: access.organizationId,
          submittedByMembershipId: access.membershipId,
          actorUserId: access.userId,
        }),
      );
    });
  });
}
/** Update only the expected unreviewed expense and atomically append its audit. */
export async function updateExpense(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "invoicing.expense:update");
      const input = updateExpenseSchema.parse(rawInput);
      return toExpenseDTO(
        await updateExpenseTx(tx, {
          ...input,
          organizationId: access.organizationId,
          actorUserId: access.userId,
          incurredAt: new Date(`${input.incurredAt}T00:00:00.000Z`),
        }),
      );
    });
  });
}

/** Approve under the established invoice-update authority, without inventing roles. */
export async function approveInvoice(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const input = invoiceCommandSchema.parse(rawInput);
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "invoicing.invoice:update");
      return toInvoiceDTO(
        await transitionInvoiceTx(tx, {
          ...input,
          organizationId: access.organizationId,
          actorUserId: access.userId,
          membershipId: access.membershipId,
          command: "approve",
        }),
      );
    });
  });
}
/** Issue only the current approved draft; generic status mutation cannot issue invoices. */
export async function issueApprovedInvoice(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const input = invoiceCommandSchema.parse(rawInput);
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "invoicing.invoice:update");
      return toInvoiceDTO(
        await transitionInvoiceTx(tx, {
          ...input,
          organizationId: access.organizationId,
          actorUserId: access.userId,
          membershipId: access.membershipId,
          command: "issue",
        }),
      );
    });
  });
}
