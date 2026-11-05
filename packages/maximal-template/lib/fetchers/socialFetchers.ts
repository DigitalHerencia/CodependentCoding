import { persistedReadLimitSchema } from "@/schemas/commonSchemas";
import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import {
  toMediaAssetDTO,
  toSocialAccountDTO,
  toSocialPostDTO,
} from "@/lib/db/dtos/socialDtos";
import {
  mediaAssetSelect,
  socialAccountSelect,
  socialPostSelect,
} from "@/lib/db/selects/socialSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getScheduledSocialPosts(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social.post:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);

    const rows = await tx.socialPost.findMany({
      where: {
        organizationId: access.organizationId,
        status: "SCHEDULED",
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: Math.min(Math.max(limit, 1), 200),
      select: socialPostSelect,
    });

    return rows.map(toSocialPostDTO);
  });
}

export async function getSocialAccounts() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social.account:read");
    const rows = await tx.socialAccount.findMany({
      where: { organizationId: access.organizationId, active: true },
      orderBy: { displayName: "asc" },
      select: socialAccountSelect,
    });
    return rows.map(toSocialAccountDTO);
  });
}

export async function getMediaAssets(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social.media:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);
    const rows = await tx.asset.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: mediaAssetSelect,
    });
    return rows.map(toMediaAssetDTO);
  });
}

export async function getSocialPosts(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social.post:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);
    const rows = await tx.socialPost.findMany({
      where: { organizationId: access.organizationId },
      orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
      take: Math.min(Math.max(limit, 1), 200),
      select: socialPostSelect,
    });
    return rows.map(toSocialPostDTO);
  });
}
