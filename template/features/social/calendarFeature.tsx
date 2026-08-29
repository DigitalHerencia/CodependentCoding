import {
  PageHeaderBlock,
  TimelineBlock,
} from "@/components/blocks/application-sections";
import { getScheduledSocialPosts } from "@/lib/fetchers/socialFetchers";

export async function CalendarFeature() {
  const posts = await getScheduledSocialPosts();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Social"
        title="Publishing calendar"
        description="Scheduled posts for the active organization."
        action={{ label: "Compose post", href: "/social/compose" }}
      />
      <TimelineBlock
        items={posts.map((post) => ({
          id: post.id,
          title: post.title ?? post.content.slice(0, 80),
          timestamp: post.scheduledAt
            ? new Date(post.scheduledAt).toLocaleString()
            : "Unscheduled",
          detail: post.variants
            .map(
              (variant) =>
                `${variant.accountDisplayName} (${variant.provider})`,
            )
            .join(", "),
        }))}
      />
    </div>
  );
}
