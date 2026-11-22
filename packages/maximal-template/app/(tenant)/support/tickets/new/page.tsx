import { SupportNewTicketFeature } from "@/features/support/supportNewTicketFeature";
import { SupportNewTicketSkeleton } from "@/features/support/supportNewTicketSkeleton";
import { Suspense } from "react";

/** Mount the new ticket feature in the tenant shell. */
export default function Page() {
  return (
    <Suspense fallback={<SupportNewTicketSkeleton />}>
      <SupportNewTicketFeature />
    </Suspense>
  );
}
