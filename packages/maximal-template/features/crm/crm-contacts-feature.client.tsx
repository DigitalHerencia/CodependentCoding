"use client";

import { CrmContactsToolbar } from "@/components/blocks/crm-blocks";
import { useCrmSearch } from "./crm-search-feature.client";

/** Contact/lead browser interaction slot; no template or data orchestration. */
export function CrmContactsFeatureClient({
  initialQuery,
  lead = false,
}: {
  initialQuery: string;
  lead?: boolean;
}) {
  const { query, onQueryChange } = useCrmSearch(initialQuery);
  return <CrmContactsToolbar query={query} onQueryChange={onQueryChange} lead={lead} />;
}
