import type { SupportTicketDTO } from "@/types/supportTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/dashboard-layout";
export function SupportAnalyticsTemplate({
  tickets,
}: {
  tickets: SupportTicketDTO[];
}) {
  return (
    <DashboardLayout title="Support queue analysis" nav={[]}>
      <p>
        Current non-closed queue, limited to {tickets.length} loaded tickets.
        This is a queue snapshot, not historical response-time reporting.
      </p>
      <DashboardPanel title="Workload by priority">
        <DashboardTable
          columns={[
            { key: "priority", label: "Priority" },
            { key: "count", label: "Tickets" },
            { key: "unassigned", label: "Unassigned" },
            { key: "waiting", label: "Waiting on customer" },
          ]}
          rows={["LOW", "NORMAL", "HIGH", "URGENT"].map((priority) => {
            const group = tickets.filter(
              (ticket) => ticket.priority === priority,
            );
            return {
              id: priority,
              cells: {
                priority,
                count: group.length,
                unassigned: group.filter((ticket) => !ticket.assignee).length,
                waiting: group.filter(
                  (ticket) => ticket.status === "WAITING_ON_CUSTOMER",
                ).length,
              },
            };
          })}
        />
      </DashboardPanel>
    </DashboardLayout>
  );
}
