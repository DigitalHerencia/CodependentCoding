"use client";

import { CrmPipelineToolbar } from "@/components/blocks/crm-blocks";
import { useCrmSearch } from "./crm-search-feature.client";

/** Pipeline browser search interaction only; no page composition. */
export function CrmPipelineFeatureClient({ initialQuery }: { initialQuery: string }) {
  const { query, onQueryChange } = useCrmSearch(initialQuery);
  return <CrmPipelineToolbar query={query} onQueryChange={onQueryChange} />;
}
