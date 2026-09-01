"use server";

import {
  approveSocialPostSchema,
  createSocialPostSchema,
  scheduleSocialPostSchema,
} from "@/schemas/socialSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toSocialPostDTO } from "@/lib/db/dto/social.dto";
import { socialPostSelect } from "@/lib/db/selects/social.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { scheduleSocialPostTx } from "@/lib/db/transactions/schedule-social-post.tx";
import { approveSocialPostTx } from "@/lib/db/transactions/social.tx";
import { buildPlatformVariant, resolvePublishTime } from "@/lib/utils/social";

export async function createSocialPost(rawInput: unknown) {
  const input = createSocialPostSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social:write");
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
  const input = scheduleSocialPostSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social:write");
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
  const input = approveSocialPostSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social:write");
    const record = await approveSocialPostTx(tx, {
      organizationId: access.organizationId,
      approverMembershipId: access.membershipId,
      ...input,
    });
    return toSocialPostDTO(record);
  });
}
