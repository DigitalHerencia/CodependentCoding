const DEFAULT_MINIMUM_LEAD_TIME_MS = 60_000;

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
