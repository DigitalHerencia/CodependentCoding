import {
  getClosedWonCrmValue,
  getContactById,
  getContacts,
  getCrmAccount,
  getCrmAccounts,
  getCrmDeal,
  getCrmDeals,
} from "@/lib/fetchers/crmFetchers";
import {
  decimalToUnits,
  formatFixedUnits,
  unitsToDecimal,
} from "@/lib/utils/money";
import { type CrmDealSummaryDTO } from "@/types/crmTypes";
import { notFound } from "next/navigation";
import "server-only";

// Decimal(19, 4) deal values weighted by whole percentages need six places.
const PIPELINE_SCALE = 6;

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

export function calculatePipelineValue(
  deals: ReadonlyArray<
    Pick<CrmDealSummaryDTO, "value" | "probability" | "stage">
  >,
) {
  const total = deals.reduce(
    (sum, deal) =>
      deal.stage === "LOST"
        ? sum
        : sum +
          (decimalToUnits(deal.value, PIPELINE_SCALE) *
            BigInt(deal.probability)) /
            100n,
    0n,
  );
  return unitsToDecimal(total, PIPELINE_SCALE);
}

export async function loadCrmAccountDetailWorkflow({
  accountId,
}: {
  accountId: string;
}) {
  const account = await getCrmAccount(accountId);
  if (!account) notFound();
  return { account };
}

export async function loadCrmAccountsWorkflow() {
  const accounts = await getCrmAccounts();
  return { accounts };
}

export async function loadCrmAnalyticsWorkflow() {
  const deals = await getCrmDeals(100);
  const groups = [...new Set(deals.map((deal) => deal.currency))].map(
    (currency) => ({
      currency,
      rows: ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"].map(
        (stage) => {
          const group = deals.filter(
            (deal) => deal.currency === currency && deal.stage === stage,
          );
          const total = group.reduce(
            (sum, deal) => sum + decimalToUnits(deal.value, PIPELINE_SCALE),
            0n,
          );
          const weighted = group.reduce(
            (sum, deal) =>
              sum +
              (decimalToUnits(deal.value, PIPELINE_SCALE) *
                BigInt(deal.probability)) /
                100n,
            0n,
          );
          return {
            id: stage,
            cells: {
              stage,
              count: group.length,
              value: formatFixedUnits(total, PIPELINE_SCALE, 2),
              weighted: formatFixedUnits(weighted, PIPELINE_SCALE, 2),
            },
          };
        },
      ),
    }),
  );
  return { count: deals.length, groups };
}

export async function loadCrmContactDetailWorkflow({
  contactId,
}: {
  contactId: string;
}) {
  const contact = await getContactById(contactId);
  if (!contact) notFound();
  return { contact };
}

export async function loadCrmContactsWorkflow() {
  const contacts = await getContacts();
  return { contacts };
}

export async function loadCrmEditAccountWorkflow({
  accountId,
}: {
  accountId: string;
}) {
  const account = await getCrmAccount(accountId);
  if (!account) notFound();
  return { account };
}

export async function loadCrmEditContactWorkflow({
  contactId,
}: {
  contactId: string;
}) {
  const contact = await getContactById(contactId);
  if (!contact) notFound();
  return { contact };
}

export async function loadCrmEditLeadWorkflow({ leadId }: { leadId: string }) {
  const contact = await getContactById(leadId);
  if (!contact) notFound();
  return { contact };
}

export async function loadCrmLeadDetailWorkflow({
  leadId,
}: {
  leadId: string;
}) {
  const contact = await getContactById(leadId);
  if (!contact) notFound();
  return { contact };
}

export async function loadCrmLeadsWorkflow() {
  const contacts = await getContacts({ status: "LEAD" });
  return { contacts };
}

export async function loadCrmPipelineWorkflow() {
  const [deals, accounts] = await Promise.all([
    getCrmDeals(100),
    getCrmAccounts(),
  ]);
  return { deals, accounts };
}
