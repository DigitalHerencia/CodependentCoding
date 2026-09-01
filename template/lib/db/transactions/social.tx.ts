import type { Prisma } from "@/generated/prisma/client";

import { socialPostSelect } from "../selects/social.selects";
import { ResourceNotFoundError } from "./errors";

export async function associateSocialMediaTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    postId: string;
    assetId: string;
    position: number;
  },
) {
  const [post, asset] = await Promise.all([
    tx.socialPost.findFirst({
      where: { id: input.postId, organizationId: input.organizationId },
      select: { id: true },
    }),
    tx.asset.findFirst({
      where: { id: input.assetId, organizationId: input.organizationId },
      select: { id: true },
    }),
  ]);
  if (!post) throw new ResourceNotFoundError("Social post");
  if (!asset) throw new ResourceNotFoundError("Media asset");
  await tx.socialPostMedia.upsert({
    where: {
      postId_assetId: { postId: post.id, assetId: asset.id },
    },
    create: {
      organizationId: input.organizationId,
      postId: post.id,
      assetId: asset.id,
      position: input.position,
    },
    update: { position: input.position },
  });
  return tx.socialPost.findFirstOrThrow({
    where: { id: post.id, organizationId: input.organizationId },
    select: socialPostSelect,
  });
}

export async function approveSocialPostTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    approverMembershipId: string;
    postId: string;
    expectedVersion: number;
  },
) {
  const post = await tx.socialPost.findFirst({
    where: {
      id: input.postId,
      organizationId: input.organizationId,
      status: "DRAFT",
      version: input.expectedVersion,
    },
    select: {
      id: true,
      variants: {
        select: { id: true, socialAccount: { select: { active: true } } },
      },
    },
  });
  if (!post) throw new ResourceNotFoundError("Approvable social post");
  if (
    !post.variants.length ||
    post.variants.some((variant) => !variant.socialAccount.active)
  ) {
    throw new Error(
      "A social post requires active, validated variants before approval.",
    );
  }
  await tx.socialPost.update({
    where: { id: post.id },
    data: {
      approvedAt: new Date(),
      approvedByMembershipId: input.approverMembershipId,
      version: { increment: 1 },
    },
  });
  return tx.socialPost.findFirstOrThrow({
    where: { id: post.id, organizationId: input.organizationId },
    select: socialPostSelect,
  });
}

export async function prepareSocialPublicationTx(
  tx: Prisma.TransactionClient,
  input: { organizationId: string; postId: string },
) {
  const post = await tx.socialPost.findFirst({
    where: {
      id: input.postId,
      organizationId: input.organizationId,
      status: { in: ["SCHEDULED", "FAILED", "PARTIALLY_FAILED"] },
      approvedAt: { not: null },
    },
    select: {
      id: true,
      variants: {
        where: { status: { in: ["SCHEDULED", "FAILED"] } },
        select: {
          id: true,
          content: true,
          socialAccount: {
            select: {
              provider: true,
              providerAccountId: true,
              credentialRef: true,
              active: true,
            },
          },
        },
      },
    },
  });
  if (!post) throw new ResourceNotFoundError("Publishable social post");
  if (!post.variants.length) {
    throw new ResourceNotFoundError("Publishable social variant");
  }
  await tx.socialPost.update({
    where: { id: post.id },
    data: { status: "PUBLISHING", version: { increment: 1 } },
  });
  return post;
}

export async function reconcileSocialPublicationTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    postId: string;
    results: readonly {
      variantId: string;
      providerPostId?: string;
      errorCode?: string;
    }[];
  },
) {
  for (const result of input.results) {
    await tx.socialVariant.updateMany({
      where: {
        id: result.variantId,
        postId: input.postId,
        organizationId: input.organizationId,
      },
      data: result.providerPostId
        ? {
            status: "PUBLISHED",
            providerPostId: result.providerPostId,
            publishedAt: new Date(),
            errorCode: null,
          }
        : {
            status: "FAILED",
            errorCode: (result.errorCode ?? "Publication failed.").slice(
              0,
              255,
            ),
          },
    });
  }
  const variants = await tx.socialVariant.findMany({
    where: { postId: input.postId, organizationId: input.organizationId },
    select: { status: true },
  });
  const published = variants.filter(
    (variant) => variant.status === "PUBLISHED",
  ).length;
  const failed = variants.filter(
    (variant) => variant.status === "FAILED",
  ).length;
  const status =
    published === variants.length
      ? "PUBLISHED"
      : failed === variants.length
        ? "FAILED"
        : "PARTIALLY_FAILED";
  await tx.socialPost.updateMany({
    where: { id: input.postId, organizationId: input.organizationId },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  return tx.socialPost.findFirstOrThrow({
    where: { id: input.postId, organizationId: input.organizationId },
    select: socialPostSelect,
  });
}
