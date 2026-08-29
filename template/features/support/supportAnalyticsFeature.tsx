import {
  MetricGridBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getSupportInbox } from "@/lib/fetchers/supportFetchers";

export async function SupportAnalyticsFeature() {
  const tickets = await getSupportInbox(200);
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Support"
        title="Inbox analytics"
        description="Counts derive from authorized active-tenant tickets."
      />
      <MetricGridBlock
        metrics={[
          { label: "Open workload", value: String(tickets.length) },
          {
            label: "Urgent",
            value: String(
              tickets.filter((ticket) => ticket.priority === "URGENT").length,
            ),
          },
          {
            label: "Waiting on customer",
            value: String(
              tickets.filter(
                (ticket) => ticket.status === "WAITING_ON_CUSTOMER",
              ).length,
            ),
          },
          {
            label: "Unassigned",
            value: String(tickets.filter((ticket) => !ticket.assignee).length),
          },
        ]}
      />
    </div>
  );
}
