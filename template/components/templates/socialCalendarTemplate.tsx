import Link from "next/link";
import type { ReactNode } from "react";
import type { SocialPostDTO } from "@/types/socialTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
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
        (post) => post.scheduledAt?.slice(0, 10) ?? "Unscheduled drafts",
      ),
    ),
  ].sort();
  return (
    <DashboardLayout title="Publishing calendar" nav={[]} toolbar={toolbar}>
      <Link className="type-link" href="/social/compose">
        Compose post
      </Link>
      <div className="space-y-5">
        {dates.map((date) => (
          <DashboardPanel key={date} title={date}>
            <div className="grid gap-4 lg:grid-cols-2">
              {posts
                .filter(
                  (post) =>
                    (post.scheduledAt?.slice(0, 10) ?? "Unscheduled drafts") ===
                    date,
                )
                .map((post) => (
                  <article
                    key={post.id}
                    className="space-y-3 surface-inset p-4"
                  >
                    <h3 className="type-label">
                      {post.title ?? "Untitled post"}
                    </h3>
                    <p className="whitespace-pre-wrap">{post.content}</p>
                    <p>
                      {post.status} ·{" "}
                      {post.scheduledAt?.slice(11, 16) ?? "No time set"} UTC
                    </p>
                    <ul>
                      {post.variants.map((variant) => (
                        <li key={variant.id}>
                          {variant.accountDisplayName} · {variant.provider} ·{" "}
                          {variant.status}
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
      {!posts.length && <p>No posts in this view.</p>}
    </DashboardLayout>
  );
}
