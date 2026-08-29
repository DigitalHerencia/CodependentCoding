import type {
  MediaAssetDTO,
  SocialAccountDTO,
  SocialPostDTO,
} from "../../../types/socialTypes";
import type {
  MediaAssetRecord,
  SocialAccountRecord,
  SocialPostRecord,
} from "../selects/social.selects";

export function toSocialAccountDTO(
  record: SocialAccountRecord,
): SocialAccountDTO {
  return {
    id: record.id,
    provider: record.provider,
    displayName: record.displayName,
  };
}
export function toMediaAssetDTO(record: MediaAssetRecord): MediaAssetDTO {
  return {
    id: record.id,
    filename: record.filename,
    contentType: record.contentType,
    byteSize: record.byteSize.toString(),
    createdAt: record.createdAt.toISOString(),
  };
}

export function toSocialPostDTO(record: SocialPostRecord): SocialPostDTO {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    status: record.status,
    scheduledAt: record.scheduledAt?.toISOString() ?? null,
    publishedAt: record.publishedAt?.toISOString() ?? null,
    version: record.version,
    variants: record.variants.map((variant) => ({
      id: variant.id,
      provider: variant.socialAccount.provider,
      accountDisplayName: variant.socialAccount.displayName,
      content: variant.content,
      status: variant.status,
      providerPostId: variant.providerPostId,
    })),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
