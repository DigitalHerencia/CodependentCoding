"use client";
import { AdminUsersToolbar } from "@/components/blocks/admin-blocks";
import { useState } from "react";
import { AdminUsersTemplate } from "@/components/templates/admin-templates";
import type { AdminMembershipDTO } from "@/types/adminTypes";
export function AdminUsersFeatureClient({
  memberships,
}: {
  memberships: AdminMembershipDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <AdminUsersTemplate
      memberships={memberships.filter((membership) =>
        `${membership.user.displayName ?? ""} ${membership.user.email ?? ""} ${membership.role}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<AdminUsersToolbar query={query} onQueryChange={setQuery} />}
    />
  );
}
