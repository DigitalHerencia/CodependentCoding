"use client";

import { AdminUsersTemplate } from "@/components/templates/admin-templates";
import { getAdminUsersNavigationWorkflow } from "@/lib/workflows/adminClientWorkflows";
import type { AdminMembershipDTO } from "@/types/adminTypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminUsersFeatureClient({
  page,
}: {
  page: {
    items: AdminMembershipDTO[];
    query: string;
    page: number;
    hasMore: boolean;
  };
}) {
  const router = useRouter();
  const [query, setQuery] = useState(page.query);
  return (
    <>
      <AdminUsersTemplate
        pagination={{
          path: "/admin/users",
          page: page.page,
          query: page.query,
          hasMore: page.hasMore,
        }}
        memberships={page.items}
        toolbarProps={{
          query: query,
          onQueryChange: setQuery,
          onSearch: () => router.push(getAdminUsersNavigationWorkflow(query)),
        }}
      />
    </>
  );
}
