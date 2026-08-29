import type { SocialProvider } from "../../../generated/prisma/client";

const characterLimits: Record<SocialProvider, number> = {
  LINKEDIN: 3_000,
  X: 280,
  FACEBOOK: 63_206,
  INSTAGRAM: 2_200,
  OTHER: 100_000,
};

export function buildPlatformVariant(
  provider: SocialProvider,
  content: string,
) {
  const normalized = content.trim();
  if (!normalized) {
    throw new Error("Social content cannot be empty.");
  }

  const limit = characterLimits[provider];
  if (normalized.length > limit) {
    throw new Error(
      `${provider} content exceeds its ${limit}-character limit.`,
    );
  }

  return normalized;
}
