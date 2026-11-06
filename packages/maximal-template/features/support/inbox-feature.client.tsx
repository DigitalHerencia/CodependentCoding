"use client";

import { SupportInboxTemplate } from "@/components/templates/support-templates";
import { selectInboxWorkflow } from "@/lib/workflows/supportClientWorkflows";
import type { SupportTicketDTO } from "@/types/supportTypes";
import { useState } from "react";

export function InboxFeatureClient({
  tickets,
}: {
  tickets: SupportTicketDTO[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  return (
    <SupportInboxTemplate
      tickets={selectInboxWorkflow(tickets, query, status)}
      toolbarProps={{
        query: query,
        onQueryChange: setQuery,
        status: status,
        onStatusChange: setStatus,
        statuses: [...new Set(tickets.map((ticket) => ticket.status))],
      }}
    />
  );
}
