import { SupportEditArticleFeature } from "@/features/support/supportEditArticleFeature";
import { SupportEditArticleSkeleton } from "@/features/support/supportEditArticleSkeleton";
import { Suspense } from "react";

/** Mount the edit article feature in the tenant shell. */
export default function Page({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  return (
    <Suspense fallback={<SupportEditArticleSkeleton />}>
      <SupportEditArticleFeature params={params} />
    </Suspense>
  );
}
