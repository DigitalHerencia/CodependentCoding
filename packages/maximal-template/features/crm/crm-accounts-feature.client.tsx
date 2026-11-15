"use client";

import { CrmAccountsToolbar } from "@/components/blocks/crm-blocks";
import { useCrmSearch } from "./crm-search-feature.client";

/** Browser interaction slot; page composition remains in the server feature. */
export function CrmAccountsFeatureClient({ initialQuery }: { initialQuery: string }) {
  const { query, onQueryChange } = useCrmSearch(initialQuery);
  return <CrmAccountsToolbar query={query} onQueryChange={onQueryChange} />;
}
