import { Suspense } from "react";

import { MediaLibraryFeature } from "@/features/social/mediaLibraryFeature";
import { MediaLibrarySkeleton } from "@/features/social/mediaLibrarySkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<MediaLibrarySkeleton />}>
      <MediaLibraryFeature />
    </Suspense>
  );
}
