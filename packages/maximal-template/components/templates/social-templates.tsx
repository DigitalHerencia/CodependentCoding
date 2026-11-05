import { socialPresentationCopy } from "@/content/social";
// Why: Templates: pure presentation for the social pages, laid out from DTOs; data and slots come from features.
import Link from "next/link";
import type { ReactNode } from "react";
import type { SocialPostDTO, MediaAssetDTO } from "@/types/socialTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/shared-blocks";

export function SocialCalendarTemplate({
  posts,
  toolbar,
  renderControls,
}: {
  posts: SocialPostDTO[];
  toolbar: ReactNode;
  renderControls: (post: SocialPostDTO) => ReactNode;
}) {
  const dates = [
    ...new Set(
      posts.map(
        (post) =>
          post.scheduledAt?.slice(0, 10) ??
          socialPresentationCopy.unscheduledDrafts,
      ),
    ),
  ].sort();
  return (
    <DashboardLayout
      title={socialPresentationCopy.publishingCalendar}
      nav={[]}
      toolbar={toolbar}
    >
      <Link className="type-link" href="/social/compose">
        {socialPresentationCopy.composePost}
      </Link>
      <div className="space-y-5">
        {dates.map((date) => (
          <DashboardPanel key={date} title={date}>
            <div className="grid gap-4 lg:grid-cols-2">
              {posts
                .filter(
                  (post) =>
                    (post.scheduledAt?.slice(0, 10) ??
                      socialPresentationCopy.unscheduledDrafts) === date,
                )
                .map((post) => (
                  <article
                    key={post.id}
                    className="space-y-3 surface-inset p-4"
                  >
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
                  </article>
                ))}
            </div>
          </DashboardPanel>
        ))}
      </div>
      {!posts.length && <p>{socialPresentationCopy.noPostsInThisView}</p>}
    </DashboardLayout>
  );
}

export function SocialComposeTemplate({
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

export function SocialMediaTemplate({
  assets,
  toolbar,
  children,
  renderControls,
}: {
  assets: MediaAssetDTO[];
  toolbar: ReactNode;
  children: ReactNode;
  renderControls: (asset: MediaAssetDTO) => ReactNode;
}) {
  return (
    <DashboardLayout
      title={socialPresentationCopy.mediaLibrary}
      nav={[]}
      toolbar={toolbar}
    >
      {children}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => (
          <article className="surface-card p-5" key={asset.id}>
            <div className="mb-4 flex aspect-video items-center justify-center surface-inset p-3 text-center type-label">
              {asset.contentType}
            </div>
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
          </article>
        ))}
      </div>
      {!assets.length && <p>{socialPresentationCopy.noMatchingMediaAssets}</p>}
    </DashboardLayout>
  );
}
