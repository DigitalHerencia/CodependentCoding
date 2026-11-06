"use client";

import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { supportBlockCopy } from "@/content/support";
import Link from "next/link";

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
      <NativeSelect
        className="control-field"
        aria-label={supportBlockCopy.ticketStatus}
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <NativeSelectOption value="">
          {supportBlockCopy.allOpenStatuses}
        </NativeSelectOption>
        {statuses.map((value) => (
          <NativeSelectOption key={value}>{value}</NativeSelectOption>
        ))}
      </NativeSelect>
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
