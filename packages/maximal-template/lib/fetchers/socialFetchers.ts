import "server-only";

import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import {
  toMediaAssetDTO,
  toSocialAccountDTO,
  toSocialPostDTO,
  toSocialVariantReviewDTO,
} from "@/lib/db/dtos/socialDtos";
import {
  mediaAssetSelect,
  socialAccountSelect,
  socialPostSelect,
  socialVariantReviewSelect,
} from "@/lib/db/selects/socialSelects";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import {
  approveSocialPostSchema,
  socialAccountCursorSchema,
} from "@/schemas/socialSchemas";

/** Read dated posts within the calendar window and reserve space for unscheduled posts. */
export async function getSocialPosts() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social.post:read");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - 90);
    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() + 366);
    const where = { organizationId: access.organizationId };
    const [dated, unscheduled] = await Promise.all([
      tx.socialPost.findMany({
        where: { ...where, scheduledAt: { gte: start, lt: end } },
        orderBy: [{ scheduledAt: "asc" }, { id: "asc" }],
        take: 50,
        select: socialPostSelect,
      }),
      tx.socialPost.findMany({
        where: { ...where, scheduledAt: null },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        take: 50,
        select: socialPostSelect,
      }),
    ]);
    return {
      posts: [...dated, ...unscheduled].map(toSocialPostDTO),
      canUpdate: hasPermission(access, "social.post:update"),
    };
  });
}

/** Read exact variant text for the sole revision still referenced by the calendar. */
export async function getSocialVariantReview(rawInput: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social.post:read");
    const { postId, expectedVersion } = approveSocialPostSchema.parse(rawInput);
    const post = await tx.socialPost.findFirst({
      where: {
        id: postId,
        organizationId: access.organizationId,
        version: expectedVersion,
      },
      select: {
        variants: {
          where: {
            organizationId: access.organizationId,
            socialAccount: { organizationId: access.organizationId },
          },
          orderBy: { id: "asc" },
          take: 20,
          select: socialVariantReviewSelect,
        },
      },
    });
    return post?.variants.map(toSocialVariantReviewDTO) ?? null;
  });
}

/** Read one sorted account page using a tenant-resolved anchor. */
export async function getSocialAccounts(rawCursor: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social.account:read");
    const cursor = socialAccountCursorSchema.parse(rawCursor);
    const scope = { organizationId: access.organizationId };
    const anchor = cursor
      ? await tx.socialAccount.findFirst({
          where: { ...scope, id: cursor },
          select: { displayName: true, id: true },
        })
      : null;
    if (cursor && !anchor) {
      throw new ResourceNotFoundError("Social account page");
    }
    const pageSize = 50;
    const rows = await tx.socialAccount.findMany({
      where: {
        ...scope,
        active: true,
        providerAccountId: { not: "" },
        ...(anchor
          ? {
              OR: [
                { displayName: { gt: anchor.displayName } },
                { displayName: anchor.displayName, id: { gt: anchor.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ displayName: "asc" }, { id: "asc" }],
      take: pageSize + 1,
      select: socialAccountSelect,
    });
    const page = rows.slice(0, pageSize);
    return {
      accounts: page.map(toSocialAccountDTO),
      nextCursor: rows.length > pageSize ? (page.at(-1)?.id ?? null) : null,
    };
  });
}

/** Read the organization's most recent uploads without resolving storage artifacts. */
export async function getMediaAssets() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "social.media:read");
    const rows = await tx.asset.findMany({
      where: { organizationId: access.organizationId },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 100,
      select: mediaAssetSelect,
    });
    return {
      assets: rows.map(toMediaAssetDTO),
      canUpload: hasPermission(access, "social.media:create"),
    };
  });
}
