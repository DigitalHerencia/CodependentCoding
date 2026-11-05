"use client";
import { InboxToolbar } from "@/components/blocks/support-blocks";
import { useState } from "react";
import { SupportInboxTemplate } from "@/components/templates/support-templates";
import type { SupportTicketDTO } from "@/types/supportTypes";
export function InboxFeatureClient({
  tickets,
}: {
  tickets: SupportTicketDTO[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  return (
    <SupportInboxTemplate
      tickets={tickets.filter(
        (ticket) =>
          (!status || ticket.status === status) &&
          `${ticket.number} ${ticket.subject} ${ticket.requester?.displayName ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      )}
      toolbar={
        <InboxToolbar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          statuses={[...new Set(tickets.map((ticket) => ticket.status))]}
        />
      }
    />
  );
}
