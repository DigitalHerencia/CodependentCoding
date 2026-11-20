import type { AudienceStatus, CampaignStatus, CampaignStepType } from "@/generated/prisma/enums";

export type CampaignDTO = {
  id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  canceledAt: string | null;
  version: number;
  audience: { id: string; name: string } | null;
  stepCount: number;
  createdAt: string;
  updatedAt: string;
};
export type AudienceDTO = {
  definition: unknown;
  id: string;
  name: string;
  status: AudienceStatus;
  createdAt: string;
  updatedAt: string;
};

export type AudienceView = AudienceDTO & {
  relationship: "active" | "lead" | "inactive" | null;
  editableDefinition: boolean;
};

/** Bounded records with a tenant-wide matching count and normalized criteria. */
export type MarketingPage<T, S extends string = string> = { items: T[]; total: number; page: number; pageSize: number; pageCount: number; criteria: { search: string; status: S | "ALL"; page: number; pageSize: number } };
export type MarketingListCriteria<S> = { search?: string; status?: S | "ALL"; page?: number; pageSize?: number };
export type CampaignListCriteria = MarketingListCriteria<CampaignStatus>;
export type AudienceListCriteria = MarketingListCriteria<AudienceStatus>;
export type CampaignStepDTO = { id: string; type: CampaignStepType; position: number; templateKey: string | null };
export type MarketingAnalyticsCriteria = { from?: string; to?: string };
/** These are planning counts; no delivery or engagement telemetry is inferred. */
export type MarketingAnalyticsDTO = {
  from: string | null; to: string | null;
  campaignTotal: number; audienceTotal: number; scheduledCampaigns: number; stepTotal: number;
  campaignStatuses: { status: CampaignStatus; count: number }[];
  audienceStatuses: { status: AudienceStatus; count: number }[];
  recentCampaigns: CampaignDTO[];
};
export type MarketingCapabilities = { canReadCampaigns: boolean; canCreateCampaigns: boolean; canUpdateCampaigns: boolean; canReadAudiences: boolean; canCreateAudiences: boolean; canUpdateAudiences: boolean };

/** Safe event command metadata; actor and organization always come from trusted access. */
export type MarketingCampaignEventInput = { campaignId: string; eventType: string; idempotencyKey: string };

// Presentation contracts are shared by forms, workflows, templates and blocks.
import type { FormEventHandler, ReactNode } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import type { z } from "zod";
import type { campaignEditorSchema, audienceFormSchema } from "@/schemas/marketingSchemas";
import type { ActionError } from "@/types/actionTypes";

export type CampaignEditorValues = z.input<typeof campaignEditorSchema>;
export type AudienceEditorValues = z.input<typeof audienceFormSchema>;
export type MarketingSection = "campaigns" | "campaign" | "campaignNew" | "campaignEdit" | "audiences" | "audience" | "audienceNew" | "audienceEdit" | "analytics";
export type MarketingPageProps = { section: MarketingSection; title?: string | undefined; toolbar?: ReactNode; children: ReactNode };
export type MarketingPaginationProps = { kind: "campaigns" | "audiences"; page: Pick<MarketingPage<unknown>, "total" | "page" | "pageCount">; previousHref: string | null; nextHref: string | null };
export type MarketingFiltersProps = { kind: "campaigns" | "audiences"; criteria: MarketingPage<unknown>["criteria"]; canCreate: boolean };
export type MarketingCampaignsProps = { page: MarketingPage<CampaignDTO, CampaignStatus>; groups: { status: CampaignStatus; items: CampaignDTO[] }[]; capabilities: MarketingCapabilities; pagination: MarketingPaginationProps };
export type MarketingAudiencesProps = { page: MarketingPage<AudienceDTO, AudienceStatus>; audiences: AudienceView[]; capabilities: MarketingCapabilities; pagination: MarketingPaginationProps };
export type MarketingCampaignDetailProps = { campaign: CampaignDTO; steps: CampaignStepDTO[]; capabilities: MarketingCapabilities; editable: boolean; children?: ReactNode };
export type MarketingAudienceDetailProps = { audience: AudienceView; canUpdate?: boolean };
export type MarketingAnalyticsProps = { analytics: MarketingAnalyticsDTO; range: { from: string; to: string } };
export type MarketingDistributionProps = { kind: "campaigns" | "audiences"; rows: { status: string; count: number }[] };
/** RHF callbacks remain owned by forms; the block receives only render bindings. */
export type MarketingFieldProps = { id: string; kind: "name" | "description" | "audienceId" | "scheduledAt" | "status" | "relationship"; field: Omit<ControllerRenderProps, "value"> & { value: string }; error?: string | undefined; audiences?: AudienceDTO[] };
export type MarketingFormFrameProps = { kind: "campaign" | "audience"; onSubmit: FormEventHandler<HTMLFormElement>; children: ReactNode; pending: boolean; error?: string | undefined; conflict: boolean; unavailable: boolean; customDefinition?: boolean; cancelHref: string; onReload: () => void };
export type MarketingLifecycleProps = { id: string; field: Omit<ControllerRenderProps, "value"> & { value: string }; transitions: readonly CampaignStatus[]; error?: string | undefined; pending: boolean; message: boolean; onSubmit: FormEventHandler<HTMLFormElement>; conflict: boolean; onReload: () => void };
export type MarketingCampaignFormProps = { campaign?: CampaignDTO; audiences: AudienceDTO[]; canSave: boolean };
export type MarketingAudienceFormProps = { audience?: AudienceView; canSave: boolean };
export type MarketingSubmissionState = { error: ActionError | null; saved: boolean };
export type MarketingRouteQuery = Record<string, string | string[] | undefined>;
export type MarketingRecordIdentity = { id: string; token: number | string };
export type MarketingLifecycleValues = z.input<import("@/schemas/marketingSchemas").campaignLifecycleEditorSchema>;
export type MarketingLifecycleFormProps = { campaign: CampaignDTO; transitions: readonly CampaignStatus[] };
