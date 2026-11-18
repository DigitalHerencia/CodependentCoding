"use client";
/** Interactive list behavior consumes only authorized transport data. */
import { AdminUsersTemplate } from "@/components/templates/admin-templates";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminListView, AdminMembershipDTO } from "@/types/adminTypes";
/** Search navigation resets pagination and encodes the query. */
export function AdminUsersFeatureClient({
  page,
  pagination,
}: AdminListView<AdminMembershipDTO>) {
  const router = useRouter();
  const [query, setQuery] = useState(page.query);
  return (
    <AdminUsersTemplate
      memberships={page.items}
      pagination={pagination}
      query={query}
      onQueryChange={setQuery}
      onSearch={() =>
        router.push(`/admin/users?${new URLSearchParams({ query })}`)
      }
    />
  );
}
