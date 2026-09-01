import type { Prisma } from "../../../generated/prisma/client";

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
    select: {
      id: true,
      content: true,
      status: true,
      providerPostId: true,
      socialAccount: {
        select: {
          provider: true,
          displayName: true,
        },
      },
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SocialPostSelect;

export type SocialPostRecord = Prisma.SocialPostGetPayload<{
  select: typeof socialPostSelect;
}>;

export const socialAccountSelect = {
  id: true,
  provider: true,
  displayName: true,
} satisfies Prisma.SocialAccountSelect;
export const mediaAssetSelect = {
  id: true,
  filename: true,
  contentType: true,
  byteSize: true,
  createdAt: true,
} satisfies Prisma.AssetSelect;
export type SocialAccountRecord = Prisma.SocialAccountGetPayload<{
  select: typeof socialAccountSelect;
}>;
export type MediaAssetRecord = Prisma.AssetGetPayload<{
  select: typeof mediaAssetSelect;
}>;
