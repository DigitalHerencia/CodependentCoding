import "server-only";

import { requireIdentity } from "@/lib/auth/auth";
import { authorizeOwnedOrAssignedWrite } from "@/lib/authz/policies";
import { toCrmContactDTO } from "@/lib/db/dto/crm.dto";
import { withTenantTransaction } from "@/lib/db/tenant";
import {
  findCrmContactForWriteTx,
  qualifyCrmLeadTx,
} from "@/lib/db/transactions/crm-qualify-lead.tx";
import { InvariantViolationError } from "@/lib/db/transactions/errors";
import { calculatePipelineValue } from "@/lib/workflows/crm/calculatePipelineValue";
import {
  getClosedWonCrmValue,
  getContactById,
  getCrmDeal,
  getCrmDeals,
  getCrmAccount,
  getContacts,
} from "@/lib/fetchers/crmFetchers";

export async function getCrmWorkspaceWorkflow(limit = 100) {
  const [deals, contacts] = await Promise.all([
    getCrmDeals(limit),
    getContacts({ limit, sort: "name-asc" }),
  ]);
  return { deals, contacts };
}

export async function getCrmRecordWorkflow(
  kind: "deal" | "contact" | "account",
  id: string,
) {
  if (kind === "deal") return getCrmDeal(id);
  if (kind === "account") return getCrmAccount(id);
  return getContactById(id);
}
/** Read → decide → write in one transaction: only a lead the member may edit becomes active. */
export async function qualifyLeadWorkflow(contactId: string) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    const contact = await findCrmContactForWriteTx(tx, {
      organizationId: access.organizationId,
      contactId,
    });
    authorizeOwnedOrAssignedWrite(access, "crm.contact:update", {
      kind: "crm.contact",
      organizationId: contact.organizationId,
      ownerMembershipId: contact.ownerMembershipId,
    });
    if (contact.status !== "LEAD")
      throw new InvariantViolationError("Only a lead can be qualified.");
    const record = await qualifyCrmLeadTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      contactId: contact.id,
    });
    return toCrmContactDTO(record);
  });
}

export async function detectStalledDealWorkflow(
  dealId: string,
  now = new Date(),
  staleAfterDays = 14,
) {
  const deal = await getCrmDeal(dealId);
  if (!deal) throw new Error("CRM deal was not found.");
  if (deal.stage === "WON" || deal.stage === "LOST") return false;
  return (
    now.getTime() - new Date(deal.updatedAt).getTime() >=
    staleAfterDays * 86_400_000
  );
}

export async function calculatePipelineValueWorkflow(limit = 100) {
  return calculatePipelineValue(await getCrmDeals(limit));
}

export async function calculateSalesVelocityWorkflow(
  periodStart: Date,
  periodEnd: Date,
) {
  if (periodEnd < periodStart) {
    throw new Error("The sales velocity period end must follow its start.");
  }
  const closedWonValue = await getClosedWonCrmValue(periodStart, periodEnd);
  const days = Math.max(
    1,
    (periodEnd.getTime() - periodStart.getTime()) / 86_400_000,
  );
  return (Number(closedWonValue) / days).toFixed(4);
}
