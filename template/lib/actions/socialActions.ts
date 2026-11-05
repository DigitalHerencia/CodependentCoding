"use server";
import { z } from "zod";
import { readPrivateBlob } from "@/lib/integrations/vercel-blob/download";

import {
  approveSocialPostSchema,
  createSocialPostSchema,
  scheduleSocialPostSchema,
} from "@/schema/socialSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toSocialPostDTO } from "@/lib/db/dtos/socialDtos";
import { socialPostSelect } from "@/lib/db/selects/socialSelects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { scheduleSocialPostTx } from "@/lib/db/transactions/socialSchedulePostTx";
import { approveSocialPostTx } from "@/lib/db/transactions/socialTx";

const characterLimits = {
  LINKEDIN: 3_000,
  X: 280,
  FACEBOOK: 63_206,
  INSTAGRAM: 2_200,
  OTHER: 100_000,
} as const;

function buildPlatformVariant(
  provider: keyof typeof characterLimits,
  content: string,
) {
  const normalized = content.trim();
  if (!normalized) throw new Error("Social content cannot be empty.");
  const limit = characterLimits[provider];
  if (normalized.length > limit) {
    throw new Error(
      `${provider} content exceeds its ${limit}-character limit.`,
    );
  }
  return normalized;
}

function resolvePublishTime(requestedAt: Date, now = new Date()): Date {
  if (!Number.isFinite(requestedAt.getTime())) {
    throw new Error("The publication time is invalid.");
  }
  if (requestedAt.getTime() < now.getTime() + 60_000) {
    throw new Error(
      "The publication time must be at least one minute in the future.",
    );
  }
  return requestedAt;
}

export async function createSocialPost(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social.post:create");
    const input = createSocialPostSchema.parse(rawInput);
    const accountIds = [
      ...new Set(input.variants.map((variant) => variant.socialAccountId)),
    ];
    const accounts = await tx.socialAccount.findMany({
      where: {
        organizationId: access.organizationId,
        id: { in: accountIds },
        active: true,
      },
      select: { id: true, provider: true },
    });
    if (accounts.length !== accountIds.length)
      throw new ResourceNotFoundError("Social account");
    const providersByAccount = new Map(
      accounts.map((account) => [account.id, account.provider]),
    );
    const record = await tx.socialPost.create({
      data: {
        organizationId: access.organizationId,
        createdByMembershipId: access.membershipId,
        title: input.title ?? null,
        content: input.content,
        variants: {
          create: input.variants.map((variant) => {
            const provider = providersByAccount.get(variant.socialAccountId);
            if (!provider) throw new ResourceNotFoundError("Social account");
            return {
              organizationId: access.organizationId,
              socialAccountId: variant.socialAccountId,
              content: buildPlatformVariant(provider, variant.content),
            };
          }),
        },
      },
      select: socialPostSelect,
    });
    return toSocialPostDTO(record);
  });
}

export async function scheduleSocialPost(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social.post:update");
    const input = scheduleSocialPostSchema.parse(rawInput);
    const record = await scheduleSocialPostTx(tx, {
      organizationId: access.organizationId,
      postId: input.postId,
      scheduledAt: resolvePublishTime(input.scheduledAt),
      expectedVersion: input.expectedVersion,
    });
    return toSocialPostDTO(record);
  });
}

export async function approveSocialPost(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social.post:update");
    const input = approveSocialPostSchema.parse(rawInput);
    const record = await approveSocialPostTx(tx, {
      organizationId: access.organizationId,
      approverMembershipId: access.membershipId,
      ...input,
    });
    return toSocialPostDTO(record);
  });
}

export async function downloadSocialMedia(rawInput: unknown) {
  const identity = await requireIdentity();
  const asset = await withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social.media:read");
    const assetId = z.string().uuid().parse(rawInput);
    const asset = await tx.asset.findFirst({
      where: { id: assetId, organizationId: access.organizationId },
      select: {
        storageProvider: true,
        storageKey: true,
        filename: true,
        contentType: true,
        byteSize: true,
      },
    });
    if (!asset || asset.byteSize > 10485760n)
      throw new Error("File unavailable or too large.");
    if (asset.storageProvider !== "vercel-blob")
      throw new Error("Unsupported file storage provider.");
    return asset;
  });
  return {
    filename: asset.filename,
    contentType: asset.contentType,
    base64: await readPrivateBlob(asset.storageKey),
  };
}
