import {
  isSocialMediaPreviewable,
  SOCIAL_SCHEDULE_MIN_LEAD_MS,
} from "@/lib/constants/social";
import type {
  MediaAssetDTO,
  SocialCalendarGroup,
  SocialPostDTO,
} from "@/types/socialTypes";

/** Apply one lead-time rule to every representation of a scheduled instant. */
export function hasSocialScheduleLeadTime(scheduledAt: Date, now = Date.now()) {
  return scheduledAt.getTime() >= now + SOCIAL_SCHEDULE_MIN_LEAD_MS;
}

/** Search the fetched calendar and group scheduled instants by their UTC date in one pass. */
export function selectSocialCalendar(posts: SocialPostDTO[], query: string) {
  const groups = new Map<string, SocialPostDTO[]>();
  const needle = query.trim().toLowerCase();
  for (const post of posts) {
    if (!`${post.title ?? ""} ${post.content}`.toLowerCase().includes(needle))
      continue;
    const key = post.scheduledAt?.slice(0, 10) ?? "unscheduled";
    const items = groups.get(key) ?? [];
    items.push(post);
    groups.set(key, items);
  }
  return Array.from(groups, ([date, items]): SocialCalendarGroup => ({
    date,
    items,
  })).sort((left, right) => left.date.localeCompare(right.date));
}
/** Filter the bounded social asset projection and derive restricted preview eligibility. */
export function selectSocialMedia(assets: MediaAssetDTO[], query: string) {
  const needle = query.trim().toLowerCase();
  return assets
    .filter((asset) =>
      `${asset.filename} ${asset.contentType}`.toLowerCase().includes(needle),
    )
    .map((asset) => ({
      ...asset,
      canPreview: isSocialMediaPreviewable(asset.contentType),
    }));
}
