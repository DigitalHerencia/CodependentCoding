import type {
  Prisma,
  SocialProvider,
  SocialPostStatus,
  SocialVariantStatus,
} from "@/generated/prisma/client";
import type {
  mediaAssetSelect,
  socialAccountSelect,
  socialPostSelect,
  socialVariantReviewSelect,
} from "@/lib/db/selects/socialSelects";
import type { ComponentProps, ReactNode } from "react";
import type { z } from "zod";
import type {
  createSocialPostSchema,
  approveSocialPostSchema,
  scheduleSocialPostFormSchema,
} from "@/schemas/socialSchemas";

/** Tenant-visible post and reviewed account variants. */
export type SocialPostDTO = {
  id: string;
  title: string | null;
  content: string;
  status: SocialPostStatus;
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
    provider: SocialProvider;
    accountDisplayName: string;
    status: SocialVariantStatus;
  }>;
};
/** Account identity available for draft target selection. */
export type SocialAccountDTO = {
  id: string;
  provider: SocialProvider;
  displayName: string;
};
/** Metadata for an asset owned by the authorized organization. */
export type MediaAssetDTO = {
  id: string;
  filename: string;
  contentType: string;
  byteSize: string;
  createdAt: string;
};

/** Asset with restricted preview eligibility. */
export type MediaAssetView = MediaAssetDTO & { canPreview: boolean };

/** Database projection used by the social DTO boundary. */
export type SocialPostRecord = Prisma.SocialPostGetPayload<{
  select: typeof socialPostSelect;
}>;

/** Database projection used by the social DTO boundary. */
export type SocialAccountRecord = Prisma.SocialAccountGetPayload<{
  select: typeof socialAccountSelect;
}>;

/** Database projection used by the social DTO boundary. */
export type MediaAssetRecord = Prisma.AssetGetPayload<{
  select: typeof mediaAssetSelect;
}>;

/** Exact variant payload delivered when a user reviews one revision. */
export type SocialVariantReviewDTO = {
  id: string;
  accountDisplayName: string;
  content: string;
};
/** Minimal persistence projection for revision-specific review. */
export type SocialVariantReviewRecord = Prisma.SocialVariantGetPayload<{
  select: typeof socialVariantReviewSelect;
}>;
/** Browser-owned review disclosure and its fetch state. */
export type SocialVariantReviewProps = {
  variants: SocialVariantReviewDTO[] | null;
  onReview: () => void;
  pending: boolean;
  unavailable: boolean;
};

/** Validated draft composition values preserve each account-specific payload. */
export type SocialNewPostValues = z.input<typeof createSocialPostSchema>;
/** Expected revision and post identity for approval. */
export type SocialApprovalValues = z.input<typeof approveSocialPostSchema>;
/** Explicit UTC form values before temporal normalization. */
export type SocialScheduleValues = z.input<typeof scheduleSocialPostFormSchema>;
/** Validated UTC scheduling instant sent to the workflow. */
export type SocialScheduleCommand = z.output<
  typeof scheduleSocialPostFormSchema
>;
/** UTC date or semantic unscheduled key and its authorized posts. */
export type SocialCalendarGroup = { date: string; items: SocialPostDTO[] };
/** Browser-owned filtering callbacks, never returned by server workflows. */
export type SocialToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};
/** Authorized post projection for calendar orchestration. */
export type SocialCalendarFeatureProps = {
  posts: SocialPostDTO[];
  canUpdate: boolean;
};
/** Calendar presentation and client-owned command slots. */
export type SocialCalendarProps = {
  groups: SocialCalendarGroup[];
  toolbarProps: SocialToolbarProps;
  renderControls: (post: SocialPostDTO) => ReactNode;
};
/** Authorized account references and the next page's stable anchor. */
export type SocialAccountPage = {
  accounts: SocialAccountDTO[];
  nextCursor: string | null;
};
/** First account page for draft composition. */
export type SocialComposerProps = { initialPage: SocialAccountPage };
/** Presentation composition for the draft form and truthful per-target previews. */
export type SocialComposeProps = {
  children: ReactNode;
  title: string;
  content: string;
  variants: Array<{ socialAccountId: string; content: string }>;
  accounts: SocialAccountDTO[];
};
/** Form-bound input and validation state resolved by a presentation block. */
export type SocialFieldProps = {
  kind: "title" | "content" | "variant" | "schedule";
  id: string;
  accountName?: string | undefined;
  error?: string | undefined;
  inputProps?: ComponentProps<"input">;
  textareaProps?: ComponentProps<"textarea">;
};
/** Target selection bindings remain owned by the RHF form. */
export type SocialTargetsProps = {
  accounts: SocialAccountDTO[];
  selected: string[];
  onToggle: (id: string, selected: boolean) => void;
  onBlur: () => void;
  error?: string | undefined;
  onLoadMore?: (() => void) | undefined;
  pending: boolean;
  pageUnavailable: boolean;
};
/** Mutation presentation describes persisted outcomes without asserting provider execution. */
export type SocialSubmitProps = {
  kind: "draft" | "approval" | "schedule";
  pending: boolean;
  disabled?: boolean;
  error?: string | undefined;
  saved?: boolean;
};
/** Revision-pinned post for existing approval and scheduling commands. */
export type SocialPostControlProps = { post: SocialPostDTO };
/** Authorized media projection consumed by a browser island. */
export type SocialMediaFeatureProps = {
  assets: MediaAssetDTO[];
  canUpload: boolean;
};
/** Media page composition delegates existing upload and bounded artifact interactions. */
export type SocialMediaProps = {
  assets: MediaAssetView[];
  toolbarProps: SocialToolbarProps;
  children: ReactNode;
  renderControls: (asset: MediaAssetView) => ReactNode;
};
/** One safe preview or bounded download, initiated and resolved in the browser. */
export type SocialMediaControlsProps = {
  asset: MediaAssetView;
  preview: string;
  pending: boolean;
  error: string;
  outcome: "idle" | "preview" | "download";
  onOpen: () => void;
  onPreviewError: () => void;
  onPreviewLoad: () => void;
};
/** Route-specific loading composition. */
export type SocialSkeletonProps = { variant: "calendar" | "compose" | "media" };
