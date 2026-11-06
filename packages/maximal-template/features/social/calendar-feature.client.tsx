"use client";

import { SocialCalendarTemplate } from "@/components/templates/social-templates";
import { selectCalendarWorkflow } from "@/lib/workflows/socialClientWorkflows";
import type { SocialPostDTO } from "@/types/socialTypes";
import { useState } from "react";
import { EditSocialPostScheduleForm } from "./editSocialPostScheduleForm";

export function CalendarFeatureClient({ posts }: { posts: SocialPostDTO[] }) {
  const [query, setQuery] = useState("");
  return (
    <SocialCalendarTemplate
      {...selectCalendarWorkflow(posts, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
      renderControls={(post) => (
        <EditSocialPostScheduleForm
          key={post.id + "-" + post.version}
          post={post}
        />
      )}
    />
  );
}
