/** Shared AI persistence, transport and presentation contracts. Secrets never cross this boundary. */
import type { Prisma } from "@/generated/prisma/client";
import type { z } from "zod";
import type {
  aiGenerationRequestSchema,
  aiPageQuerySchema,
} from "@/schemas/aiSchemas";
import type {
  aiGenerationSelect,
  aiUsageSelect,
} from "@/lib/db/selects/aiSelects";
import type { ControllerRenderProps } from "react-hook-form";
import type { FormEventHandler } from "react";

/** Historical PENDING/CANCELED rows remain readable; new requests only run, succeed or fail. */
export type AiGenerationStatus =
  "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELED";
export type AiGenerationRequest = z.infer<typeof aiGenerationRequestSchema>;
export type AiPageQuery = z.input<typeof aiPageQuerySchema>;
export type AiGenerationRecord = Prisma.AiGenerationGetPayload<{
  select: typeof aiGenerationSelect;
}>;
export type AiUsageRecord = Prisma.AiUsageLedgerGetPayload<{
  select: typeof aiUsageSelect;
}>;

/** Null means unreported measurement; decimal costs retain precision across transport. */
export type AiMeasurements = {
  inputTokens: number | null;
  outputTokens: number | null;
  cost: string | null;
};
export type AiGenerationDTO = AiMeasurements & {
  id: string;
  provider: string;
  model: string;
  status: AiGenerationStatus;
  errorCode: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
};
export type AiUsageRecordDTO = AiMeasurements & {
  id: string;
  generationId: string;
  provider: string;
  model: string;
  occurredAt: string;
};
/** Coverage counts distinguish partially reported sums from complete provider totals. */
export type AiUsageSummaryDTO = AiMeasurements & {
  generationCount: number;
  measuredInputCount: number;
  measuredOutputCount: number;
  measuredCostCount: number;
};
/** An extra fetched row establishes whether Next exists, without an unbounded history load. */
export type AiPage<T> = { items: T[]; page: number; hasNextPage: boolean };
export type AiScope = { from: string; to: string; label: string };
export type AiReadScope = { from: Date; to: Date };
export type AiConfiguration = {
  configured: boolean;
  provider: "Hugging Face";
  model: string;
  canGenerate: boolean;
};
export type AiOverviewView = {
  generations: AiPage<AiGenerationDTO>;
  summary: AiUsageSummaryDTO;
  activity: AiUsageRecordDTO[];
  scope: AiScope;
  generationCount: number;
  succeededCount: number;
  failedCount: number;
  runningCount: number;
  configuration: AiConfiguration;
};
export type AiUsageView = {
  usage: AiPage<AiUsageRecordDTO>;
  summary: AiUsageSummaryDTO;
  scope: AiScope;
};
export type AiGenerationResult = {
  generationId: string;
  text: string;
  model: string;
};
/** Integration-owned normalized inference result; usage is never estimated. */
export type AiInferenceResult = AiMeasurements & { text: string };
export type AiInferenceInput = AiGenerationRequest & { model: string };
export type AiRecentScope = { read: AiReadScope; display: AiScope };
export type AiGenerationOwner = { organizationId: string; userId: string };
export type AiStartGenerationInput = AiGenerationOwner & {
  provider: string;
  model: string;
  prompt: string;
};
export type AiGenerationTransition = AiGenerationOwner & {
  generationId: string;
};
export type AiCompleteGenerationInput = AiGenerationTransition &
  AiInferenceResult;
export type AiUsageAggregate = Prisma.GetAiUsageLedgerAggregateType<{
  _sum: { inputTokens: true; outputTokens: true; cost: true };
  _count: { _all: true; inputTokens: true; outputTokens: true; cost: true };
}>;

/** Form state and submission remain in the form; blocks receive only bindings and view state. */
export type AiGenerationFormProps = {
  configuration: AiConfiguration;
  promptField: ControllerRenderProps<AiGenerationRequest, "prompt">;
  promptError?: string | undefined;
  error?: string | undefined;
  output: string;
  pending: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

/** Shared component contracts keep presentation signatures consistent across domain layers. */
export type AiHeaderProps = {
  route: "overview" | "playground" | "usage";
  scope?: AiScope;
};
export type AiOverviewMetricsProps = Pick<
  AiOverviewView,
  "generationCount" | "succeededCount" | "failedCount" | "runningCount"
>;
export type AiSummaryProps = { summary: AiUsageSummaryDTO };
export type AiHistoryProps = { generations: AiPage<AiGenerationDTO> };
export type AiUsageRecordsProps = {
  records: AiUsageRecordDTO[];
  activity?: boolean;
};
export type AiPaginationProps = {
  page: number;
  hasNextPage: boolean;
  usage?: boolean;
};
export type AiConfigurationProps = Pick<AiGenerationFormProps, "configuration">;
export type AiPromptProps = Pick<
  AiGenerationFormProps,
  "promptField" | "promptError" | "pending" | "configuration"
>;
export type AiSubmitProps = Pick<
  AiGenerationFormProps,
  "pending" | "error" | "configuration"
>;
export type AiOutputProps = Pick<AiGenerationFormProps, "pending" | "output">;
export type AiRouteSearchParams = { page?: string | string[] };
export type AiFeatureProps = { criteria: Promise<AiRouteSearchParams> };
export type AiRoutePageProps = { searchParams: Promise<AiRouteSearchParams> };
export type AiErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
export type AiErrorProps = { onRetry: () => void };
