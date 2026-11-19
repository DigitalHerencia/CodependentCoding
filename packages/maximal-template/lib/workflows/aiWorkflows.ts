"use server";

import "server-only";
import {
  getAiCapabilities,
  getAiOverviewData,
  getAiUsageData,
} from "@/lib/fetchers/aiFetchers";
import { generateAiResponse } from "@/lib/actions/aiActions";
import { isHuggingFaceConfigured } from "@/lib/integrations/hugging-face/client";
import { getConfiguredHuggingFaceModel } from "@/lib/integrations/hugging-face/inference";
import type {
  AiConfiguration,
  AiOverviewView,
  AiUsageView,
  AiRecentScope,
} from "@/types/aiTypes";

/** A server-owned rolling thirty-day UTC scope; URL input cannot broaden the authorization window. */
function recentScope(): AiRecentScope {
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 86_400_000);
  return {
    read: { from, to },
    display: {
      from: from.toISOString(),
      to: to.toISOString(),
      label:
        "Your generations in the current organization · last 30 days (UTC)",
    },
  };
}

function configuration(canGenerate: boolean): AiConfiguration {
  return {
    configured: isHuggingFaceConfigured(),
    provider: "Hugging Face",
    model: getConfiguredHuggingFaceModel(),
    canGenerate,
  };
}

/** Compose one overview from bounded metadata and full-window SQL aggregates. */
export async function loadAiOverviewWorkflow(
  rawQuery: unknown = {},
): Promise<AiOverviewView> {
  const scope = recentScope();
  const { canGenerate, ...data } = await getAiOverviewData(
    rawQuery,
    scope.read,
  );
  return {
    ...data,
    configuration: configuration(canGenerate),
    scope: scope.display,
  };
}

/** Provider configuration is server-owned and readable only after the AI permission check. */
export async function loadAiPlaygroundWorkflow() {
  const { canGenerate } = await getAiCapabilities();
  return { configuration: configuration(canGenerate) };
}

/** Paginated records and totals describe the same personal organization/date scope. */
export async function loadAiUsageWorkflow(
  rawQuery: unknown = {},
): Promise<AiUsageView> {
  const scope = recentScope();
  return {
    ...(await getAiUsageData(rawQuery, scope.read)),
    scope: scope.display,
  };
}

/** The form's sole mutation entry delegates all validation and authorization to its action. */
export async function generateAiResponseWorkflow(rawInput: unknown) {
  return generateAiResponse(rawInput);
}
