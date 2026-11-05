"use client";
import { supportBlockCopy } from "@/content/support";
import Link from "next/link";
import { Input } from "@/components/ui/input";
export function InboxToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  statuses,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={supportBlockCopy.searchTickets}
        placeholder={supportBlockCopy.searchSubjectNumberOrRequester}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <select
        className="control-field"
        aria-label={supportBlockCopy.ticketStatus}
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="">{supportBlockCopy.allOpenStatuses}</option>
        {statuses.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <Link className="type-link" href="/support/tickets/new">
        {supportBlockCopy.newTicket}
      </Link>
    </div>
  );
}
export function KnowledgeBaseToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={supportBlockCopy.searchKnowledgeBase}
        placeholder={supportBlockCopy.searchArticles}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Link className="type-link" href="/support/knowledge-base/new">
        {supportBlockCopy.writeArticle}
      </Link>
    </div>
  );
}
