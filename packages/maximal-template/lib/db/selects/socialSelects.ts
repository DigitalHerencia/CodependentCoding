import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/** Calendar and command read model without credential or storage metadata. */
export const socialPostSelect = {
  id: true,
  title: true,
  content: true,
  status: true,
  scheduledAt: true,
  publishedAt: true,
  approvedAt: true,
  approvedBy: {
    select: {
      id: true,
      user: { select: { displayName: true } },
    },
  },
  version: true,
  variants: {
    orderBy: { id: "asc" },
    take: 20,
    select: {
      id: true,
      status: true,

      socialAccount: {
        select: {
          provider: true,
          displayName: true,
        },
      },
    },
  },
} satisfies Prisma.SocialPostSelect;

/** Exact variant text is loaded on demand for a single reviewed revision. */
export const socialVariantReviewSelect = {
  id: true,
  content: true,
  socialAccount: { select: { displayName: true } },
} satisfies Prisma.SocialVariantSelect;

/** Versioned receipt for a local command. */
export const socialPostReceiptSelect = {
  id: true,
  status: true,
  version: true,
} satisfies Prisma.SocialPostSelect;

/** Public identity of an eligible target account. */
export const socialAccountSelect = {
  id: true,
  provider: true,
  displayName: true,
} satisfies Prisma.SocialAccountSelect;
/** User-facing metadata for an authorized uploads asset. */
export const mediaAssetSelect = {
  id: true,
  filename: true,
  contentType: true,
  byteSize: true,
  createdAt: true,
} satisfies Prisma.AssetSelect;
