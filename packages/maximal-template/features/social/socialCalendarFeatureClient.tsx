"use client";
import {
  SocialCalendarTemplate,
  SocialVariantReviewTemplate,
} from "@/components/templates/social-templates";
import { loadSocialVariantReviewWorkflow } from "@/lib/workflows/socialWorkflows";
import { selectSocialCalendar } from "@/lib/utils/social";
import type {
  SocialCalendarFeatureProps,
  SocialPostControlProps,
  SocialVariantReviewDTO,
} from "@/types/socialTypes";
import { Fragment, useState, useTransition } from "react";
import { SocialEditPostScheduleForm } from "./socialEditPostScheduleForm";

/** Own browser search state and revision-keyed approval/scheduling forms. */
export function SocialCalendarFeatureClient({
  posts,
  canUpdate,
}: SocialCalendarFeatureProps) {
  const [query, setQuery] = useState("");
  return (
    <SocialCalendarTemplate
      groups={selectSocialCalendar(posts, query)}
      toolbarProps={{ query, onQueryChange: setQuery }}
      renderControls={(post) => (
        <Fragment key={`${post.id}-${post.version}`}>
          {post.variants.length > 0 && <SocialVariantReview post={post} />}
          {canUpdate && <SocialEditPostScheduleForm post={post} />}
        </Fragment>
      )}
    />
  );
}

/** Fetch exact variant content only on demand and discard it on close or revision change. */
function SocialVariantReview({ post }: SocialPostControlProps) {
  const [variants, setVariants] = useState<SocialVariantReviewDTO[] | null>(
    null,
  );
  const [pending, startTransition] = useTransition();
  const [unavailable, setUnavailable] = useState(false);
  return (
    <SocialVariantReviewTemplate
      variants={variants}
      pending={pending}
      unavailable={unavailable}
      onReview={() => {
        if (variants) {
          setVariants(null);
          return;
        }
        setUnavailable(false);
        startTransition(async () => {
          try {
            const review = await loadSocialVariantReviewWorkflow({
              postId: post.id,
              expectedVersion: post.version,
            });
            if (review?.length) setVariants(review);
            else setUnavailable(true);
          } catch {
            setUnavailable(true);
          }
        });
      }}
    />
  );
}
