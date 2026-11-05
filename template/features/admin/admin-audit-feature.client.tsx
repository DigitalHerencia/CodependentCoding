"use client";
import { AdminAuditToolbar } from "@/components/blocks/admin-blocks";
import { useState } from "react";
import { AdminAuditTemplate } from "@/components/templates/admin-templates";
import type { AuditEventDTO } from "@/types/adminTypes";
export function AdminAuditFeatureClient({
  events,
}: {
  events: AuditEventDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <AdminAuditTemplate
      events={events.filter((event) =>
        `${event.action} ${event.resourceType} ${event.actor?.displayName ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<AdminAuditToolbar query={query} onQueryChange={setQuery} />}
    />
  );
}
