import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import {
  toMediaAssetDTO,
  toSocialAccountDTO,
  toSocialPostDTO,
} from "@/lib/db/dto/social.dto";
import {
  mediaAssetSelect,
  socialAccountSelect,
  socialPostSelect,
} from "@/lib/db/selects/social.selects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getScheduledSocialPosts(limit = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social:read");

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
    assertPermission(access, "social:read");
    const rows = await tx.socialAccount.findMany({
      where: { organizationId: access.organizationId, active: true },
      orderBy: { displayName: "asc" },
      select: socialAccountSelect,
    });
    return rows.map(toSocialAccountDTO);
  });
}

export async function getMediaAssets(limit = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social:read");
    const rows = await tx.asset.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: mediaAssetSelect,
    });
    return rows.map(toMediaAssetDTO);
  });
}

export async function getSocialPosts(limit = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social:read");
    const rows = await tx.socialPost.findMany({
      where: { organizationId: access.organizationId },
      orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
      take: Math.min(Math.max(limit, 1), 200),
      select: socialPostSelect,
    });
    return rows.map(toSocialPostDTO);
  });
}
