import { SupportKnowledgeBaseFeature } from "@/features/support/supportKnowledgeBaseFeature";
import { SupportKnowledgeBaseSkeleton } from "@/features/support/supportKnowledgeBaseSkeleton";
import type { SupportSearchParams } from "@/types/supportTypes";
import { Suspense } from "react";

/** Mount the knowledge base feature in the tenant shell. */
export default function Page({
  searchParams,
}: {
  searchParams: Promise<SupportSearchParams>;
}) {
  return (
    <Suspense fallback={<SupportKnowledgeBaseSkeleton />}>
      <SupportKnowledgeBaseFeature searchParams={searchParams} />
    </Suspense>
  );
}
