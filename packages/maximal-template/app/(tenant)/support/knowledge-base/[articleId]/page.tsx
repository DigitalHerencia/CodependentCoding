import { SupportArticleFeature } from "@/features/support/supportArticleFeature";
import { SupportArticleSkeleton } from "@/features/support/supportArticleSkeleton";
import { Suspense } from "react";

/** Mount the article feature in the tenant shell. */
export default function Page({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  return (
    <Suspense fallback={<SupportArticleSkeleton />}>
      <SupportArticleFeature params={params} />
    </Suspense>
  );
}
