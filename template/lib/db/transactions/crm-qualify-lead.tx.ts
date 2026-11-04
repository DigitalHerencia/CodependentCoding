import "server-only";

import type { Prisma } from "@/generated/prisma/client";

import { crmContactSelect } from "@/lib/db/selects/crm.selects";
import { ConcurrencyConflictError, ResourceNotFoundError } from "./errors";

/** The contact a write is about to change: who owns it and what state it is in. */
export async function findCrmContactForWriteTx(
  tx: Prisma.TransactionClient,
  input: { organizationId: string; contactId: string },
) {
  const contact = await tx.crmContact.findFirst({
    where: {
      id: input.contactId,
      organizationId: input.organizationId,
      archivedAt: null,
    },
    select: {
      id: true,
      organizationId: true,
      ownerMembershipId: true,
      status: true,
    },
  });
  if (!contact) throw new ResourceNotFoundError("CRM contact");
  return contact;
}

/** LEAD → ACTIVE, audited. The status predicate makes a concurrent qualify a CONFLICT. */
export async function qualifyCrmLeadTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    actorUserId: string;
    contactId: string;
    ownerMembershipId: string | null;
  },
) {
  const result = await tx.crmContact.updateMany({
    where: {
      id: input.contactId,
      organizationId: input.organizationId,
      archivedAt: null,
      status: "LEAD",
      ownerMembershipId: input.ownerMembershipId,
    },
    data: { status: "ACTIVE" },
  });
  if (result.count !== 1) throw new ConcurrencyConflictError("CRM contact");
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "crm.contact.qualified",
      resourceType: "CrmContact",
      resourceId: input.contactId,
    },
  });
  return tx.crmContact.findFirstOrThrow({
    where: { id: input.contactId, organizationId: input.organizationId },
    select: crmContactSelect,
  });
}
