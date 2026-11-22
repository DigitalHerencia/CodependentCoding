import { Suspense } from "react";
import { SocialMediaFeature } from "@/features/social/socialMediaFeature";
import { SocialMediaSkeleton } from "@/features/social/socialMediaSkeleton";

/** Preserve the tenant-shell route with its social loading boundary. */
export default function Page() {
  return (
    <Suspense fallback={<SocialMediaSkeleton />}>
      <SocialMediaFeature />
    </Suspense>
  );
}
