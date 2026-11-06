"use client";

import {
  CrmContactsTemplate,
  CrmLeadsTemplate,
} from "@/components/templates/crm-templates";
import { selectCrmContactsWorkflow } from "@/lib/workflows/crmClientWorkflows";
import type { CrmContactDTO } from "@/types/crmTypes";
import { useState } from "react";

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
      contacts={selectCrmContactsWorkflow(contacts, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery, lead: lead }}
    />
  );
}
