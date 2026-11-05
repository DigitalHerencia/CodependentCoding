import { Suspense } from "react";

import { MediaLibraryFeature } from "@/features/social/media-library-feature";
import { MediaLibrarySkeleton } from "@/features/social/media-library-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<MediaLibrarySkeleton />}>
      <MediaLibraryFeature />
    </Suspense>
  );
}
