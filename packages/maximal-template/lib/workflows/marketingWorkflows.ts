"use server";

import "server-only";
import { notFound } from "next/navigation";
import { getAudience, getAudiences, getCampaign, getCampaigns, getCampaignSteps, getMarketingAnalytics, getMarketingCapabilities } from "@/lib/fetchers/marketingFetchers";
import { createAudience, updateAudience, createCampaign, updateCampaign, updateCampaignStatus } from "@/lib/actions/marketingActions";
import { audienceDefinitionSchema, campaignTransitions, campaignEditorCommandSchema, audienceEditorCommandSchema, marketingAnalyticsQuerySchema } from "@/schemas/marketingSchemas";
import { toActionResult } from "@/lib/utils/actionResult";
import type { AudienceDTO, AudienceView, MarketingPage, MarketingPaginationProps, MarketingRouteQuery } from "@/types/marketingTypes";

/** Resolve structured rule semantics; all user-facing language stays in blocks. */
function describeAudience(audience: AudienceDTO): AudienceView {
  const parsed = audienceDefinitionSchema.safeParse(audience.definition);
  return { ...audience, editableDefinition: parsed.success, relationship: parsed.success ? parsed.data.rules[0]!.value : null };
}

function pagination(kind: "campaigns" | "audiences", page: MarketingPage<unknown>): MarketingPaginationProps {
  const href = (number: number) => {
    const query = new URLSearchParams({ search: page.criteria.search, status: page.criteria.status, page: String(number), pageSize: String(page.pageSize) });
    return `/marketing/${kind}?${query}`;
  };
  return { kind, page, previousHref: page.page > 1 ? href(page.page - 1) : null, nextHref: page.page < page.pageCount ? href(page.page + 1) : null };
}

/** Preserve the shared workspace contract while using authorized paged fetchers. */
export async function getMarketingWorkspaceWorkflow(limit = 50) {
  const [campaigns, audiences] = await Promise.all([getCampaigns(limit), getAudiences(limit)]);
  return { campaigns: campaigns.items, audiences: audiences.items };
}

/** Read a requested record directly by its validated tenant-scoped identifier. */
export async function getMarketingRecordWorkflow(kind: "campaign" | "audience", id: string) {
  return kind === "campaign" ? getCampaign(id) : getAudience(id);
}

/** Existing campaign planning metrics are persisted record fields, never delivery estimates. */
export async function calculateCampaignMetricsWorkflow(campaignId: string) {
  const campaign = await getCampaign(campaignId);
  if (!campaign) notFound();
  return campaign;
}

/** Compose filters, status groups, capability hints and deterministic pagination. */
export async function loadCampaignsWorkflow(criteria: unknown = {}) {
  const [page, capabilities] = await Promise.all([getCampaigns(criteria), getMarketingCapabilities()]);
  return { page, groups: Object.keys(campaignTransitions).map((status) => ({ status: status as keyof typeof campaignTransitions, items: page.items.filter((campaign) => campaign.status === status) })).filter((group) => group.items.length), capabilities, pagination: pagination("campaigns", page) };
}

/** Normalize persisted audience rules without replacing unsupported definitions. */
export async function loadAudiencesWorkflow(criteria: unknown = {}) {
  const [page, capabilities] = await Promise.all([getAudiences(criteria), getMarketingCapabilities()]);
  return { page, audiences: page.items.map(describeAudience), capabilities, pagination: pagination("audiences", page) };
}

/** Load a single campaign and prepare only currently possible lifecycle commands. */
export async function loadCampaignWorkflow({ campaignId }: { campaignId: string }) {
  const [campaign, capabilities] = await Promise.all([getCampaign(campaignId), getMarketingCapabilities()]);
  if (!campaign) notFound();
  const steps = await getCampaignSteps(campaignId);
  const transitions = capabilities.canUpdateCampaigns ? campaignTransitions[campaign.status].filter((status) => status !== "SCHEDULED" || Boolean(campaign.scheduledAt && new Date(campaign.scheduledAt) > new Date())) : [];
  return { campaign, steps, capabilities, editable: ["DRAFT", "SCHEDULED", "PAUSED"].includes(campaign.status), transitions };
}

/** Keep the editor's existing audience even when it is outside the first option page. */
export async function loadCampaignEditWorkflow(input: { campaignId: string }) {
  const { campaign, capabilities, editable } = await loadCampaignWorkflow(input);
  const options = capabilities.canReadAudiences ? (await getAudiences(100)).items : [];
  if (capabilities.canReadAudiences && campaign.audience && !options.some((item) => item.id === campaign.audience!.id)) {
    const selected = await getAudience(campaign.audience.id);
    if (selected) options.push(selected);
  }
  return { campaign, audiences: options, canSave: capabilities.canUpdateCampaigns && editable };
}

/** Prepare creation without adding another authentication or administrator shell gate. */
export async function loadCampaignNewWorkflow() {
  const capabilities = await getMarketingCapabilities();
  const audiences = capabilities.canCreateCampaigns && capabilities.canReadAudiences ? (await getAudiences(100)).items : [];
  return { audiences, canSave: capabilities.canCreateCampaigns };
}

/** The audience editor can preserve unsupported rules while changing metadata. */
export async function loadAudienceWorkflow({ audienceId }: { audienceId: string }) {
  const [audience, capabilities] = await Promise.all([getAudience(audienceId), getMarketingCapabilities()]);
  if (!audience) notFound();
  return { audience: describeAudience(audience), canUpdate: capabilities.canUpdateAudiences };
}

/** Load edit data directly and pass current mutation authority as a hint. */
export async function loadAudienceEditWorkflow(input: { audienceId: string }) {
  const { audience, canUpdate } = await loadAudienceWorkflow(input);
  return { audience, canSave: canUpdate };
}

/** Prepare a new audience form using the existing tenant authorization policy. */
export async function loadAudienceNewWorkflow() {
  const capabilities = await getMarketingCapabilities();
  return { canSave: capabilities.canCreateAudiences };
}

/** Default to the last thirty UTC days and include all matching persisted records. */
export async function loadMarketingAnalyticsWorkflow(query: MarketingRouteQuery = {}) {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const start = new Date(tomorrow.getTime() - 30 * 86400000);
  const range = marketingAnalyticsQuerySchema.parse({ from: query.from ?? start.toISOString().slice(0, 10), to: query.to ?? tomorrow.toISOString().slice(0, 10) });
  const from = range.from ?? start.toISOString().slice(0, 10);
  const to = range.to ?? tomorrow.toISOString().slice(0, 10);
  const analytics = await getMarketingAnalytics({ from: `${from}T00:00:00.000Z`, to: `${to}T00:00:00.000Z` });
  return { analytics: { ...analytics, campaignStatuses: Object.keys(campaignTransitions).map((status) => ({ status: status as keyof typeof campaignTransitions, count: analytics.campaignStatuses.find((row) => row.status === status)?.count ?? 0 })), audienceStatuses: (["DRAFT", "ACTIVE", "ARCHIVED"] as const).map((status) => ({ status, count: analytics.audienceStatuses.find((row) => row.status === status)?.count ?? 0 })) }, range: { from, to } };
}

/** Translate explicitly UTC editor values and preserve sub-minute schedule precision. */
export async function saveCampaignWorkflow(command: unknown) {
  const prepared = await toActionResult(async () => {
    const { values, record } = campaignEditorCommandSchema.parse(command);
    let scheduledAt: string | null = values.scheduledAt ? `${values.scheduledAt}:00.000Z` : null;
    if (record) {
      const existing = await getCampaign(record.id);
      if (existing?.scheduledAt?.slice(0, 16) === values.scheduledAt) scheduledAt = existing.scheduledAt;
    }
    return { input: { ...values, scheduledAt, audienceId: values.audienceId || null }, record };
  });
  if (!prepared.ok) return prepared;
  const { input, record } = prepared.data;
  return record ? updateCampaign({ ...input, campaignId: record.id, expectedVersion: record.version }) : createCampaign(input);
}

/** Preserve unrepresentable persisted definitions based on a fresh authorized read. */
export async function saveAudienceWorkflow(command: unknown) {
  const prepared = await toActionResult(async () => {
    const parsed = audienceEditorCommandSchema.parse(command);
    if (!parsed.record) return { values: parsed.values, record: null, preserve: false };
    const existing = await getAudience(parsed.record.id);
    return { ...parsed, preserve: Boolean(existing && !audienceDefinitionSchema.safeParse(existing.definition).success) };
  });
  if (!prepared.ok) return prepared;
  const { values, record, preserve } = prepared.data;
  if (!record) return createAudience(values);
  return updateAudience({ name: values.name, status: values.status, ...(preserve ? {} : { definition: values.definition }), audienceId: record.id, expectedUpdatedAt: record.updatedAt });
}

/** Every planning command delegates to the independently secured mutation boundary. */
export async function updateCampaignStatusWorkflow(input: unknown) {
  return updateCampaignStatus(input);
}

