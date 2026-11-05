"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminUsersToolbar,
  AdminPagination,
} from "@/components/blocks/admin-blocks";
import { AdminUsersTemplate } from "@/components/templates/admin-templates";
import type { AdminMembershipDTO } from "@/types/adminTypes";
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
        memberships={page.items}
        toolbar={
          <AdminUsersToolbar
            query={query}
            onQueryChange={setQuery}
            onSearch={() =>
              router.push(
                "/admin/users?" + new URLSearchParams({ query }).toString(),
              )
            }
          />
        }
      />
      <AdminPagination
        path="/admin/users"
        page={page.page}
        query={page.query}
        hasMore={page.hasMore}
      />
    </>
  );
}
