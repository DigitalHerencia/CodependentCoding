import {
  archiveContact,
  createContact,
  createCrmDeal,
  updateContact,
  updateCrmDealStage,
} from "@/lib/actions/crmActions";
import {
  getContactById,
  getCrmDeal,
  getCrmDeals,
} from "@/lib/fetchers/crmFetchers";
import type {
  CloseDealCommand,
  ReopenOpportunityCommand,
} from "@/types/crmTypes";

export const createCrmDealWorkflow = createCrmDeal;
export const updateCrmDealStageWorkflow = updateCrmDealStage;
export const createContactWorkflow = createContact;
export const updateContactWorkflow = updateContact;
export const archiveContactWorkflow = archiveContact;

export async function closeDealWorkflow(input: CloseDealCommand) {
  return updateCrmDealStage({ ...input, stage: input.outcome });
}

export async function reopenOpportunityWorkflow(
  input: ReopenOpportunityCommand,
) {
  return updateCrmDealStage({ ...input, stage: "QUALIFIED" });
}

export async function qualifyLeadWorkflow(contactId: string) {
  const contact = await getContactById(contactId);
  if (!contact) throw new Error("CRM lead was not found.");
  if (contact.status !== "LEAD")
    throw new Error("Only a lead can be qualified.");
  return updateContact({
    contactId: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    title: contact.title,
    status: "ACTIVE",
    expectedUpdatedAt: new Date(contact.updatedAt),
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
  const deals = await getCrmDeals(limit);
  return deals
    .filter((deal) => deal.stage !== "LOST")
    .reduce((total, deal) => total + Number(deal.value), 0)
    .toFixed(4);
}

export async function calculateSalesVelocityWorkflow(
  periodStart: Date,
  periodEnd: Date,
) {
  const summaries = await getCrmDeals(100);
  const deals = await Promise.all(
    summaries
      .filter((deal) => deal.stage === "WON")
      .map((deal) => getCrmDeal(deal.id)),
  );
  const days = Math.max(
    1,
    (periodEnd.getTime() - periodStart.getTime()) / 86_400_000,
  );
  const value = deals.reduce((total, deal) => {
    if (!deal?.closedAt) return total;
    const closedAt = new Date(deal.closedAt);
    return closedAt >= periodStart && closedAt <= periodEnd
      ? total + Number(deal.value)
      : total;
  }, 0);
  return (value / days).toFixed(4);
}
