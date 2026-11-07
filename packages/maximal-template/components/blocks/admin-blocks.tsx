"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminBlockCopy, adminPaginationCopy } from "@/content/admin";
import Link from "next/link";

export function AdminAuditToolbar({
  query,
  onQueryChange,
  onSearch,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <Input
        aria-label={adminBlockCopy.searchAuditEvents}
        placeholder={adminBlockCopy.searchActionResourceOrActor}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Button type="submit">{adminPaginationCopy.search}</Button>
    </form>
  );
}
export function AdminUsersToolbar({
  query,
  onQueryChange,
  onSearch,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}) {
  return (
    <form
      className="flex flex-wrap gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <Link className="type-link" href="/admin/users/new">
        {adminBlockCopy.addRegisteredMember}
      </Link>
      <Input
        aria-label={adminBlockCopy.searchMembers}
        placeholder={adminBlockCopy.searchNameEmailOrRole}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Button type="submit">{adminPaginationCopy.search}</Button>
    </form>
  );
}

export function AdminPagination({
  path,
  page,
  query,
  hasMore,
}: {
  path: string;
  page: number;
  query: string;
  hasMore: boolean;
}) {
  const href = (next: number) =>
    path + "?" + new URLSearchParams({ query, page: String(next) }).toString();
  return (
    <nav
      aria-label={adminPaginationCopy.pagination}
      className="flex items-center gap-4 p-4"
    >
      {page > 1 && (
        <Link href={href(page - 1)}>{adminPaginationCopy.previous}</Link>
      )}
      <span>
        {adminPaginationCopy.page} {page}
      </span>
      {hasMore && <Link href={href(page + 1)}>{adminPaginationCopy.next}</Link>}
    </nav>
  );
}
