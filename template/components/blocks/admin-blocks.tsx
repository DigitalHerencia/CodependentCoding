"use client";
import { adminBlockCopy } from "@/content/admin";
import Link from "next/link";
import { Input } from "@/components/ui/input";
export function AdminAuditToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <Input
      aria-label={adminBlockCopy.searchAuditEvents}
      placeholder={adminBlockCopy.searchActionResourceOrActor}
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
export function AdminUsersToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link className="type-link" href="/admin/users/new">
        {adminBlockCopy.addRegisteredMember}
      </Link>
      <Input
        aria-label={adminBlockCopy.searchMembers}
        placeholder={adminBlockCopy.searchNameEmailOrRole}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </div>
  );
}
