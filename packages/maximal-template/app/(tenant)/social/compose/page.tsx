import { Suspense } from "react";
import { SocialComposeFeature } from "@/features/social/socialComposeFeature";
import { SocialComposeSkeleton } from "@/features/social/socialComposeSkeleton";

/** Preserve the tenant-shell route with its social loading boundary. */
export default function Page() {
  return (
    <Suspense fallback={<SocialComposeSkeleton />}>
      <SocialComposeFeature />
    </Suspense>
  );
}
