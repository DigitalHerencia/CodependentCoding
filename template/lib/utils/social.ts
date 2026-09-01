const characterLimits = {
  LINKEDIN: 3_000,
  X: 280,
  FACEBOOK: 63_206,
  INSTAGRAM: 2_200,
  OTHER: 100_000,
} as const;

const DEFAULT_MINIMUM_LEAD_TIME_MS = 60_000;

export function buildPlatformVariant(provider: string, content: string) {
  const normalized = content.trim();
  if (!normalized) throw new Error("Social content cannot be empty.");
  if (!(provider in characterLimits)) {
    throw new Error("The social provider is unsupported.");
  }
  const limit = characterLimits[provider as keyof typeof characterLimits];
  if (normalized.length > limit) {
    throw new Error(
      `${provider} content exceeds its ${limit}-character limit.`,
    );
  }
  return normalized;
}

export function resolvePublishTime(
  requestedAt: Date,
  now = new Date(),
  minimumLeadTimeMs = DEFAULT_MINIMUM_LEAD_TIME_MS,
): Date {
  if (!Number.isFinite(requestedAt.getTime())) {
    throw new Error("The publication time is invalid.");
  }
  if (requestedAt.getTime() < now.getTime() + minimumLeadTimeMs) {
    throw new Error(
      "The publication time must be at least one minute in the future.",
    );
  }
  return requestedAt;
}
