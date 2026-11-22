import "server-only";

import type {
  MediaAssetDTO,
  SocialAccountDTO,
  SocialPostDTO,
  MediaAssetRecord,
  SocialAccountRecord,
  SocialPostRecord,
  SocialVariantReviewDTO,
  SocialVariantReviewRecord,
} from "@/types/socialTypes";

/** Serialize account identity without provider credentials. */
export function toSocialAccountDTO(
  record: SocialAccountRecord,
): SocialAccountDTO {
  return {
    id: record.id,
    provider: record.provider,
    displayName: record.displayName,
  };
}
/** Serialize safe file metadata across the server boundary. */
export function toMediaAssetDTO(record: MediaAssetRecord): MediaAssetDTO {
  return {
    id: record.id,
    filename: record.filename,
    contentType: record.contentType,
    byteSize: record.byteSize.toString(),
    createdAt: record.createdAt.toISOString(),
  };
}

/** Serialize lifecycle and approval without eagerly sending every variant's content. */
export function toSocialPostDTO(record: SocialPostRecord): SocialPostDTO {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    status: record.status,
    scheduledAt: record.scheduledAt?.toISOString() ?? null,
    publishedAt: record.publishedAt?.toISOString() ?? null,
    approvedAt: record.approvedAt?.toISOString() ?? null,
    approvedBy: record.approvedBy
      ? {
          membershipId: record.approvedBy.id,
          displayName: record.approvedBy.user.displayName,
        }
      : null,
    version: record.version,
    variants: record.variants.map((variant) => ({
      id: variant.id,
      provider: variant.socialAccount.provider,
      accountDisplayName: variant.socialAccount.displayName,
      status: variant.status,
    })),
  };
}

/** Keep reviewed content exact and associate it with its target's display name. */
export function toSocialVariantReviewDTO(
  record: SocialVariantReviewRecord,
): SocialVariantReviewDTO {
  return {
    id: record.id,
    accountDisplayName: record.socialAccount.displayName,
    content: record.content,
  };
}
