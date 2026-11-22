import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { z } from "zod";
import type { createSocialPostSchema } from "@/schemas/socialSchemas";
import { ZodError } from "zod";
import { SOCIAL_VARIANT_CODE_UNIT_LIMITS } from "@/lib/constants/socialProviderPolicy";
import { hasSocialScheduleLeadTime } from "@/lib/utils/social";
import { socialPostReceiptSelect } from "@/lib/db/selects/socialSelects";
import {
  ConcurrencyConflictError,
  InvariantViolationError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";

/** Resolve eligible targets and commit parent content and variants as one aggregate. */
export async function createSocialPostTx(
  tx: Prisma.TransactionClient,
  scope: { organizationId: string; membershipId: string },
  input: z.output<typeof createSocialPostSchema>,
) {
  const accountIds = input.variants.map(
    ({ socialAccountId }) => socialAccountId,
  );
  const accounts = await tx.socialAccount.findMany({
    where: {
      organizationId: scope.organizationId,
      id: { in: accountIds },
      active: true,
      providerAccountId: { not: "" },
    },
    select: { id: true, provider: true },
  });
  if (accounts.length !== accountIds.length) {
    throw new ResourceNotFoundError("Social account");
  }
  const providers = new Map(accounts.map(({ id, provider }) => [id, provider]));
  const variants = input.variants.map((variant, index) => {
    const provider = providers.get(variant.socialAccountId);
    if (
      !provider ||
      !Object.hasOwn(SOCIAL_VARIANT_CODE_UNIT_LIMITS, provider)
    ) {
      throw new InvariantViolationError(
        "Social provider policy is unavailable.",
      );
    }
    const limit = SOCIAL_VARIANT_CODE_UNIT_LIMITS[provider];
    if (variant.content.length > limit) {
      throw new ZodError([
        {
          code: "custom",
          path: ["variants", index, "content"],
          message: `Use at most ${limit} UTF-16 code units for this account.`,
        },
      ]);
    }
    return { ...variant, organizationId: scope.organizationId };
  });
  return tx.socialPost.create({
    data: {
      organizationId: scope.organizationId,
      createdByMembershipId: scope.membershipId,
      title: input.title ?? null,
      content: input.content,
      variants: { create: variants },
    },
    select: socialPostReceiptSelect,
  });
}

/** Require an eligible target and exclude mismatched or inactive accounts. */
function eligibleTargets(organizationId: string) {
  const account = {
    organizationId,
    active: true,
    providerAccountId: { not: "" },
  };
  return {
    some: { organizationId, socialAccount: account },
    every: { organizationId, socialAccount: account },
  } satisfies Prisma.SocialVariantListRelationFilter;
}

/** Approve an eligible draft through a conditional update of the reviewed revision. */
export async function approveSocialPostTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    approverMembershipId: string;
    postId: string;
    expectedVersion: number;
  },
) {
  const where = { id: input.postId, organizationId: input.organizationId };
  const result = await tx.socialPost.updateMany({
    where: {
      ...where,
      status: "DRAFT",
      version: input.expectedVersion,
      variants: eligibleTargets(input.organizationId),
    },
    data: {
      approvedAt: new Date(),
      approvedByMembershipId: input.approverMembershipId,
      version: { increment: 1 },
    },
  });
  if (result.count !== 1)
    throw new ConcurrencyConflictError("Approvable social post");
  return tx.socialPost.findFirstOrThrow({
    where,
    select: socialPostReceiptSelect,
  });
}

/** Persist schedule intent for an approved revision without changing confirmed variants. */
export async function scheduleSocialPostTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    postId: string;
    scheduledAt: Date;
    expectedVersion: number;
  },
) {
  if (!hasSocialScheduleLeadTime(input.scheduledAt)) {
    throw new InvariantViolationError(
      "Choose a time at least one minute in the future.",
    );
  }

  const where = { id: input.postId, organizationId: input.organizationId };
  const pending = {
    in: ["DRAFT", "FAILED", "SCHEDULED"],
  } satisfies Prisma.EnumSocialVariantStatusFilter;
  const targets = eligibleTargets(input.organizationId);
  const result = await tx.socialPost.updateMany({
    where: {
      ...where,
      version: input.expectedVersion,
      status: { in: ["DRAFT", "FAILED"] },
      approvedAt: { not: null },
      approvedBy: { organizationId: input.organizationId },
      variants: { ...targets, some: { ...targets.some, status: pending } },
    },
    data: {
      status: "SCHEDULED",
      scheduledAt: input.scheduledAt,
      version: { increment: 1 },
    },
  });
  if (result.count !== 1)
    throw new ConcurrencyConflictError("Approved social post");

  await tx.socialVariant.updateMany({
    where: {
      organizationId: input.organizationId,
      postId: input.postId,
      status: pending,
    },
    data: { status: "SCHEDULED" },
  });
  return tx.socialPost.findFirstOrThrow({
    where,
    select: socialPostReceiptSelect,
  });
}
