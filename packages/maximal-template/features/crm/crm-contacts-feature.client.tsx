"use client";
import { CrmContactsToolbar } from "@/components/blocks/crm-blocks";
import { useState } from "react";
import {
  CrmContactsTemplate,
  CrmLeadsTemplate,
} from "@/components/templates/crm-templates";
import type { CrmContactDTO } from "@/types/crmTypes";
export function CrmContactsFeatureClient({
  contacts,
  lead = false,
}: {
  contacts: CrmContactDTO[];
  lead?: boolean;
}) {
  const [query, setQuery] = useState("");
  const Template = lead ? CrmLeadsTemplate : CrmContactsTemplate;
  return (
    <Template
      lead={lead}
      contacts={contacts.filter((contact) =>
        `${contact.firstName} ${contact.lastName} ${contact.email ?? ""} ${contact.account?.name ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={
        <CrmContactsToolbar
          query={query}
          onQueryChange={setQuery}
          lead={lead}
        />
      }
    />
  );
}
