import { SupportInboxFeature } from "@/features/support/supportInboxFeature";
import { SupportInboxSkeleton } from "@/features/support/supportInboxSkeleton";
import type { SupportSearchParams } from "@/types/supportTypes";
import { Suspense } from "react";

/** Mount the inbox feature in the tenant shell. */
export default function Page({
  searchParams,
}: {
  searchParams: Promise<SupportSearchParams>;
}) {
  return (
    <Suspense fallback={<SupportInboxSkeleton />}>
      <SupportInboxFeature searchParams={searchParams} />
    </Suspense>
  );
}
