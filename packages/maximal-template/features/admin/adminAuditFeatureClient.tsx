"use client";
/** Interactive list behavior consumes only authorized transport data. */
import { AdminAuditTemplate } from "@/components/templates/admin-templates";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminListView, AuditEventDTO } from "@/types/adminTypes";
/** Search navigation resets pagination and encodes the query. */
export function AdminAuditFeatureClient({
  page,
  pagination,
  metrics,
}: AdminListView<AuditEventDTO>) {
  const router = useRouter();
  const [query, setQuery] = useState(page.query);
  return (
    <AdminAuditTemplate
      metrics={metrics}
      events={page.items}
      pagination={pagination}
      query={query}
      onQueryChange={setQuery}
      onSearch={() =>
        router.push(`/admin/audit?${new URLSearchParams({ query })}`)
      }
    />
  );
}
