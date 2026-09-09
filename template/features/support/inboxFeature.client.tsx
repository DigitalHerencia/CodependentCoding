"use client";
import Link from "next/link";
import { useState } from "react";
import { SupportInboxTemplate } from "@/components/templates/supportInboxTemplate";
import { Input } from "@/components/ui/input";
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
        <div className="flex flex-wrap gap-3">
          <Input
            aria-label="Search tickets"
            placeholder="Search subject, number or requester"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="control-field"
            aria-label="Ticket status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All open statuses</option>
            {[...new Set(tickets.map((ticket) => ticket.status))].map(
              (value) => (
                <option key={value}>{value}</option>
              ),
            )}
          </select>
          <Link className="type-link" href="/support/tickets/new">
            New ticket
          </Link>
        </div>
      }
    />
  );
}
