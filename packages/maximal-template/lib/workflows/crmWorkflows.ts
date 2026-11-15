"use server";

import {
  getClosedWonCrmValue,
  getContactById,
  getContacts,
  getCrmAccount,
  getCrmAccounts,
  getCrmDeal,
  getCrmDeals,
  getCrmAccountsPage,
  getCrmContactsPage,
  getCrmDealsPage,
  getCrmDealAnalytics,
} from "@/lib/fetchers/crmFetchers";
import { decimalToUnits, formatFixedUnits } from "@/lib/utils/money";
import { calculateCrmPipelineValue } from "@/lib/utils/crmMoney";
import {
  createCrmAccount,
  updateCrmAccount,
  createContact,
  updateContact,
  createCrmDeal,
  updateCrmDealStage,
  qualifyCrmLead,
} from "@/lib/actions/crmActions";
import { createContactSchema } from "@/schemas/crmSchemas";
import { notFound } from "next/navigation";
import "server-only";

// -----------------------------------------------------------------------------
// CRM read orchestration
// -----------------------------------------------------------------------------
/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function getCrmWorkspaceWorkflow(limit = 100) {
  const [deals, contacts] = await Promise.all([
    getCrmDeals(limit),
    getContacts({ limit, sort: "name-asc" }),
  ]);
  return { deals, contacts };
}

/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function getCrmRecordWorkflow(
  kind: "deal" | "contact" | "account",
  id: string,
) {
  if (kind === "deal") return getCrmDeal(id);
  if (kind === "account") return getCrmAccount(id);
  return getContactById(id);
}
/** Compose a CRM route-level server operation from authorized read or write functions. */
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

/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function calculatePipelineValueWorkflow(limit = 100) {
  return calculateCrmPipelineValue(await getCrmDeals(limit));
}

/** Compose a CRM route-level server operation from authorized read or write functions. */
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

/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function loadCrmAccountDetailWorkflow({
  accountId,
}: {
  accountId: string;
}) {
  const account = await getCrmAccount(accountId);
  if (!account) notFound();
  return { account };
}

/** Compose persisted account search, filters and stable pagination. */
export async function loadCrmAccountsWorkflow(criteria: unknown = {}) {
  const page = await getCrmAccountsPage(criteria);
  return { accounts: page.items, pageInfo: page.pageInfo, criteria: page.criteria };
}

/** Aggregate every CRM opportunity by currency and stage (never first-page totals). */
export async function loadCrmAnalyticsWorkflow() {
  const results = await getCrmDealAnalytics();
  const currencies = Array.from(new Set(results.map((row) => row.currency)));
  const stages = ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] as const;
  const groups = currencies.map((currency) => ({
    currency,
    rows: stages.map((stage) => {
      const record = results.find((row) => row.currency === currency && row.stage === stage);
      return {
        id: stage,
        cells: {
          stage,
          count: record?.count ?? 0,
          value: formatFixedUnits(decimalToUnits(record?.value ?? "0", 6), 6, 2),
          weighted: formatFixedUnits(decimalToUnits(record?.weighted ?? "0", 6), 6, 2),
        },
      };
    }),
  }));
  return {
    count: results.reduce((sum, result) => sum + result.count, 0),
    groups,
  };
}

/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function loadCrmContactDetailWorkflow({
  contactId,
}: {
  contactId: string;
}) {
  const contact = await getContactById(contactId);
  if (!contact) notFound();
  return { contact };
}

/** Compose persisted contact search, filters, and stable pagination. */
export async function loadCrmContactsWorkflow(criteria: unknown = {}) {
  const page = await getCrmContactsPage(criteria);
  return { contacts: page.items, pageInfo: page.pageInfo, criteria: page.criteria };
}

/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function loadCrmEditAccountWorkflow({
  accountId,
}: {
  accountId: string;
}) {
  const account = await getCrmAccount(accountId);
  if (!account) notFound();
  return { account };
}

/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function loadCrmEditContactWorkflow({
  contactId,
}: {
  contactId: string;
}) {
  const contact = await getContactById(contactId);
  if (!contact) notFound();
  return { contact };
}

/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function loadCrmEditLeadWorkflow({ leadId }: { leadId: string }) {
  const contact = await getContactById(leadId);
  if (!contact || contact.status !== "LEAD") notFound();
  return { contact };
}

/** Compose a CRM route-level server operation from authorized read or write functions. */
export async function loadCrmLeadDetailWorkflow({
  leadId,
}: {
  leadId: string;
}) {
  const contact = await getContactById(leadId);
  if (!contact || contact.status !== "LEAD") notFound();
  return { contact, qualifyLead: qualifyCrmLeadWorkflow };
}

/** Lead directory always filters LEAD regardless of external URL status. */
export async function loadCrmLeadsWorkflow(rawCriteria: unknown = {}) {
  const criteria = typeof rawCriteria === "object" && rawCriteria !== null
    ? { ...rawCriteria, status: "LEAD" }
    : { status: "LEAD" };
  const page = await getCrmContactsPage(criteria);
  return { contacts: page.items, pageInfo: page.pageInfo, criteria: page.criteria };
}

/** Server pipeline: paginated deals and account references for new opportunity. */
export async function loadCrmPipelineWorkflow(criteria: unknown = {}) {
  const [page, accounts] = await Promise.all([
    getCrmDealsPage(criteria),
    getCrmAccounts(200),
  ]);
  const stages = (["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] as const).map(
    (stage) => ({ stage, items: page.items.filter((deal) => deal.stage === stage) }),
  );
  return { stages, accounts, pageInfo: page.pageInfo, criteria: page.criteria };
}

// -----------------------------------------------------------------------------
// Client-callable CRM Server Functions; persistence remains in crmActions.
// -----------------------------------------------------------------------------
/** Create an account with server authorization and cache coherence. */
export async function createCrmAccountWorkflow(input: unknown) {
  return createCrmAccount(input);
}
/** Update an account through its validated, authorized action. */
export async function updateCrmAccountWorkflow(input: unknown) {
  return updateCrmAccount(input);
}
/** Create a contact or lead with its validated, authorized action. */
export async function createCrmContactWorkflow(input: unknown) {
  return createContact(input);
}
/** Update a contact or lead with its validated, authorized action. */
export async function updateCrmContactWorkflow(input: unknown) {
  return updateContact(input);
}
/** Qualify a lead using the dedicated CRM transition and audit action. */
export async function qualifyCrmLeadWorkflow(id: unknown) {
  return qualifyCrmLead(id);
}
/** Create a CRM opportunity with authorized linked records. */
export async function createCrmDealWorkflow(input: unknown) {
  return createCrmDeal(input);
}
/** Advance a deal using its version-checked transition transaction. */
export async function updateCrmDealStageWorkflow(input: unknown) {
  return updateCrmDealStage(input);
}


/** Create a lead with LEAD status enforced on the server, independent of browser fields. */
export async function createCrmLeadWorkflow(input: unknown) {
  const parsed = createContactSchema.parse(input);
  return createContact({ ...parsed, status: "LEAD" });
}
