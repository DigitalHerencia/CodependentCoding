"use client";

import { AdminAuditTemplate } from "@/components/templates/admin-templates";
import { getAdminAuditNavigationWorkflow } from "@/lib/workflows/adminClientWorkflows";
import type { AuditEventDTO } from "@/types/adminTypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        pagination={{
          path: "/admin/audit",
          page: page.page,
          query: page.query,
          hasMore: page.hasMore,
        }}
        events={page.items}
        toolbarProps={{
          query: query,
          onQueryChange: setQuery,
          onSearch: () => router.push(getAdminAuditNavigationWorkflow(query)),
        }}
      />
    </>
  );
}
