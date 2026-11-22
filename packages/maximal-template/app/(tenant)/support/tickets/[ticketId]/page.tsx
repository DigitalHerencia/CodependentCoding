import { SupportTicketFeature } from "@/features/support/supportTicketFeature";
import { SupportTicketSkeleton } from "@/features/support/supportTicketSkeleton";
import type { SupportSearchParams } from "@/types/supportTypes";
import { Suspense } from "react";

/** Mount the ticket feature in the tenant shell. */
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ ticketId: string }>;
  searchParams: Promise<SupportSearchParams>;
}) {
  return (
    <Suspense fallback={<SupportTicketSkeleton />}>
      <SupportTicketFeature params={params} searchParams={searchParams} />
    </Suspense>
  );
}
