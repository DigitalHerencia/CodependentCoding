"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SocialCalendarTemplate } from "@/components/templates/socialCalendarTemplate";
import {
  approveSocialPost,
  scheduleSocialPost,
} from "@/lib/actions/socialActions";
import type { SocialPostDTO } from "@/types/socialTypes";
function SchedulePost({ post }: { post: SocialPostDTO }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  if (!["DRAFT", "FAILED"].includes(post.status)) return null;
  return (
    <div className="space-y-2">
      {!post.approvedAt ? (
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                await approveSocialPost({
                  postId: post.id,
                  expectedVersion: post.version,
                });
                router.refresh();
              } catch {
                setMessage(
                  "Approval failed. Check permissions or refresh the post.",
                );
              }
            })
          }
        >
          Approve draft
        </Button>
      ) : (
        <form
          className="flex flex-wrap gap-3"
          action={(data) =>
            startTransition(async () => {
              try {
                await scheduleSocialPost({
                  postId: post.id,
                  expectedVersion: post.version,
                  scheduledAt: `${data.get("time")}Z`,
                });
                router.refresh();
              } catch {
                setMessage(
                  "Scheduling failed. Choose a time at least one minute in the future, or refresh the post.",
                );
              }
            })
          }
        >
          <Input
            type="datetime-local"
            name="time"
            required
            aria-label="Publish time in UTC"
          />
          <Button type="submit" disabled={pending}>
            Schedule (UTC)
          </Button>
        </form>
      )}
      <p role="status">{message}</p>
    </div>
  );
}
export function CalendarFeatureClient({ posts }: { posts: SocialPostDTO[] }) {
  const [query, setQuery] = useState("");
  return (
    <SocialCalendarTemplate
      posts={posts.filter((post) =>
        `${post.title ?? ""} ${post.content}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={
        <Input
          aria-label="Search posts"
          placeholder="Search posts"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      }
      renderControls={(post) => (
        <SchedulePost key={`${post.id}-${post.version}`} post={post} />
      )}
    />
  );
}
