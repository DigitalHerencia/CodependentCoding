"use client";
import { useState } from "react";
import { SocialCalendarTemplate } from "@/components/templates/social-templates";
import { SocialCalendarToolbar } from "@/components/blocks/social-blocks";
import { SchedulePost } from "./social-post-form";
import type { SocialPostDTO } from "@/types/socialTypes";
export function CalendarFeatureClient({ posts }: { posts: SocialPostDTO[] }) {
  const [query, setQuery] = useState("");
  return (
    <SocialCalendarTemplate
      posts={posts.filter((post) =>
        ((post.title ?? "") + " " + post.content)
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<SocialCalendarToolbar query={query} onQueryChange={setQuery} />}
      renderControls={(post) => (
        <SchedulePost key={post.id + "-" + post.version} post={post} />
      )}
    />
  );
}
