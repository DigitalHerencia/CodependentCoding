import { DashboardPanel } from "@/components/blocks/shared-blocks";
import {
  MediaLibraryToolbar,
  SocialCalendarToolbar,
} from "@/components/blocks/social-blocks";
import { Card } from "@/components/ui/card";
import { socialPresentationCopy } from "@/content/social";
import type { MediaAssetView, SocialPostDTO } from "@/types/socialTypes";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Why: Templates: pure presentation for the social pages, laid out from DTOs; data and slots come from features.

export function SocialCalendarContentBlock({
  groups,
  renderControls,
}: {
  groups: readonly { date: string; items: SocialPostDTO[] }[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof SocialCalendarToolbar>;
  renderControls: (post: SocialPostDTO) => ReactNode;
}) {
  return (
    <>
      <Link className="type-link" href="/social/compose">
        {socialPresentationCopy.composePost}
      </Link>
      <div className="space-y-5">
        {groups.map(({ date, items }) => (
          <DashboardPanel key={date} title={date}>
            <div className="grid gap-4 lg:grid-cols-2">
              {items.map((post) => (
                <Card variant="inset" key={post.id} className="space-y-3 p-4">
                  <h3 className="type-label">
                    {post.title ?? socialPresentationCopy.untitledPost}
                  </h3>
                  <p className="whitespace-pre-wrap">{post.content}</p>
                  <p>
                    {post.status}
                    {socialPresentationCopy.separator2}{" "}
                    {post.scheduledAt?.slice(11, 16) ??
                      socialPresentationCopy.noTimeSet}
                    {socialPresentationCopy.uTC}
                  </p>
                  <ul>
                    {post.variants.map((variant) => (
                      <li key={variant.id}>
                        {variant.accountDisplayName}
                        {socialPresentationCopy.separator}
                        {variant.provider}
                        {socialPresentationCopy.separator2} {variant.status}
                      </li>
                    ))}
                  </ul>
                  {renderControls(post)}
                </Card>
              ))}
            </div>
          </DashboardPanel>
        ))}
      </div>
      {!groups.length && <p>{socialPresentationCopy.noPostsInThisView}</p>}
    </>
  );
}

export function SocialComposePageBlock({
  children,
  preview,
}: {
  children: ReactNode;
  preview: ReactNode;
}) {
  return (
    <section className="space-y-5 p-5">
      <h1 className="type-title">
        {socialPresentationCopy.composeASocialPost}
      </h1>
      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
        <section className="surface-card p-5">{children}</section>
        <aside className="space-y-4 surface-inset p-5">
          <h2 className="type-label">{socialPresentationCopy.postPreview}</h2>
          {preview}
        </aside>
      </div>
    </section>
  );
}

export function SocialMediaContentBlock({
  assets,
  children,
  renderControls,
}: {
  assets: MediaAssetView[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof MediaLibraryToolbar>;
  children: ReactNode;
  renderControls: (asset: MediaAssetView) => ReactNode;
}) {
  return (
    <>
      {children}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => (
          <Card className="p-5" key={asset.id}>
            <Card
              variant="inset"
              className="mb-4 flex aspect-video items-center justify-center p-3 text-center type-label"
            >
              {asset.contentType}
            </Card>
            <h2 className="type-label break-all">{asset.filename}</h2>
            <p className="mt-3 text-sm">
              {asset.byteSize}
              {socialPresentationCopy.bytes}
            </p>
            <p className="text-sm text-muted-primary">
              {socialPresentationCopy.added}
              {asset.createdAt.slice(0, 10)}
            </p>
            {renderControls(asset)}
          </Card>
        ))}
      </div>
      {!assets.length && <p>{socialPresentationCopy.noMatchingMediaAssets}</p>}
    </>
  );
}

export function SocialCalendarToolbarBlock(
  props: ComponentProps<typeof SocialCalendarContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? (
    <SocialCalendarToolbar {...toolbarProps} />
  ) : (
    toolbarSlot
  );
}
export function SocialMediaToolbarBlock(
  props: ComponentProps<typeof SocialMediaContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <MediaLibraryToolbar {...toolbarProps} /> : toolbarSlot;
}
