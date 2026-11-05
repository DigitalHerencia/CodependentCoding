import { Suspense } from "react";

import { TicketFeature } from "@/features/support/ticket-feature";
import { TicketSkeleton } from "@/features/support/ticket-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  return (
    <Suspense fallback={<TicketSkeleton />}>
      <TicketFeature ticketId={ticketId} />
    </Suspense>
  );
}
