import { TicketFeature } from "@/features/support/ticketFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  return <TicketFeature ticketId={ticketId} />;
}
