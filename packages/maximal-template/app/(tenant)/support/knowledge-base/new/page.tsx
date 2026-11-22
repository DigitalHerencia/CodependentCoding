import { SupportNewArticleFeature } from "@/features/support/supportNewArticleFeature";
import { SupportNewArticleSkeleton } from "@/features/support/supportNewArticleSkeleton";
import { Suspense } from "react";

/** Mount the new article feature in the tenant shell. */
export default function Page() {
  return (
    <Suspense fallback={<SupportNewArticleSkeleton />}>
      <SupportNewArticleFeature />
    </Suspense>
  );
}
