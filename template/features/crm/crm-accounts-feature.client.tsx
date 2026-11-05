"use client";
import { CrmAccountsToolbar } from "@/components/blocks/crm-blocks";
import { useState } from "react";
import { CrmAccountsTemplate } from "@/components/templates/crm-templates";
import type { CrmAccountDTO } from "@/types/crmTypes";
export function CrmAccountsFeatureClient({
  accounts,
}: {
  accounts: CrmAccountDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <CrmAccountsTemplate
      accounts={accounts.filter((account) =>
        `${account.name} ${account.industry ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<CrmAccountsToolbar query={query} onQueryChange={setQuery} />}
    />
  );
}
