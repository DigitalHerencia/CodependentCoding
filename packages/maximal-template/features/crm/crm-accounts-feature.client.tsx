"use client";

import { CrmAccountsTemplate } from "@/components/templates/crm-templates";
import { selectCrmAccountsWorkflow } from "@/lib/workflows/crmClientWorkflows";
import type { CrmAccountDTO } from "@/types/crmTypes";
import { useState } from "react";

export function CrmAccountsFeatureClient({
  accounts,
}: {
  accounts: CrmAccountDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <CrmAccountsTemplate
      accounts={selectCrmAccountsWorkflow(accounts, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
    />
  );
}
