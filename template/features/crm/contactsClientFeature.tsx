"use client";

import { useMemo, useState } from "react";

import {
  DataTableBlock,
  DataTableToolbarBlock,
} from "@/components/blocks/application-sections";
import type {
  ContactSort,
  CrmContactDTO,
  EditableContactStatus,
} from "@/types/crmTypes";

export function ContactsClientFeature({
  contacts,
}: {
  contacts: CrmContactDTO[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | EditableContactStatus>("all");
  const [sort, setSort] = useState<ContactSort>("name-asc");

  const visibleContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = contacts.filter((contact) => {
      const matchesStatus = status === "all" || contact.status === status;
      const searchable = [
        contact.firstName,
        contact.lastName,
        contact.email ?? "",
        contact.account?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return matchesStatus && searchable.includes(normalizedQuery);
    });

    return filtered.toSorted((left, right) => {
      if (sort === "updated-desc") {
        return right.updatedAt.localeCompare(left.updatedAt);
      }
      const comparison = `${left.lastName} ${left.firstName}`.localeCompare(
        `${right.lastName} ${right.firstName}`,
      );
      return sort === "name-desc" ? -comparison : comparison;
    });
  }, [contacts, query, sort, status]);

  return (
    <div className="space-y-4">
      <DataTableToolbarBlock
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={(value) =>
          setStatus(value as "all" | EditableContactStatus)
        }
        sort={sort}
        onSortChange={(value) => setSort(value as ContactSort)}
        resultCount={visibleContacts.length}
      />
      <DataTableBlock
        columns={[
          { key: "name", label: "Contact" },
          { key: "account", label: "Account" },
          { key: "email", label: "Email" },
          { key: "status", label: "Status" },
        ]}
        rows={visibleContacts.map((contact) => ({
          id: contact.id,
          href: `/crm/contacts/${contact.id}`,
          cells: {
            name: `${contact.firstName} ${contact.lastName}`,
            account: contact.account?.name ?? null,
            email: contact.email,
            status: contact.status,
          },
        }))}
        emptyMessage="No contacts match the active filters."
      />
    </div>
  );
}
