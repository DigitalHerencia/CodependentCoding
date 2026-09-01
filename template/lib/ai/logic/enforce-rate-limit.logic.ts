export class AiRateLimitError extends Error {
  constructor() {
    super("The AI generation rate limit has been reached. Try again later.");
    this.name = "AiRateLimitError";
  }
}

export function enforceRateLimit({
  recentGenerationCount,
  limit,
}: {
  recentGenerationCount: number;
  limit: number;
}) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("The AI rate limit must be a positive integer.");
  }
  if (recentGenerationCount >= limit) throw new AiRateLimitError();
}

