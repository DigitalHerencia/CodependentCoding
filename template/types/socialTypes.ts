export type SocialPostDTO = {
  id: string;
  title: string | null;
  content: string;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  approvedAt: string | null;
  approvedBy: {
    membershipId: string;
    displayName: string | null;
  } | null;
  version: number;
  variants: Array<{
    id: string;
    provider: string;
    accountDisplayName: string;
    content: string;
    status: string;
    providerPostId: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
};
export type SocialAccountDTO = {
  id: string;
  provider: string;
  displayName: string;
};
export type MediaAssetDTO = {
  id: string;
  filename: string;
  contentType: string;
  byteSize: string;
  createdAt: string;
};
