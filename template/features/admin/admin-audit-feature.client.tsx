"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminAuditToolbar,
  AdminPagination,
} from "@/components/blocks/admin-blocks";
import { AdminAuditTemplate } from "@/components/templates/admin-templates";
import type { AuditEventDTO } from "@/types/adminTypes";
export function AdminAuditFeatureClient({
  page,
}: {
  page: {
    items: AuditEventDTO[];
    query: string;
    page: number;
    hasMore: boolean;
  };
}) {
  const router = useRouter();
  const [query, setQuery] = useState(page.query);
  return (
    <>
      <AdminAuditTemplate
        events={page.items}
        toolbar={
          <AdminAuditToolbar
            query={query}
            onQueryChange={setQuery}
            onSearch={() =>
              router.push(
                "/admin/audit?" + new URLSearchParams({ query }).toString(),
              )
            }
          />
        }
      />
      <AdminPagination
        path="/admin/audit"
        page={page.page}
        query={page.query}
        hasMore={page.hasMore}
      />
    </>
  );
}
