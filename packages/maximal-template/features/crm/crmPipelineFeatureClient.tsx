"use client";

import { CrmListFiltersBlock, CrmPaginationBlock } from "@/components/blocks/crm-blocks";
import type { CrmPageInfo } from "@/types/crmTypes";
import { useCrmSearch, type CrmSearchState } from "./crmSearchFeatureClient";

/** CRM_Pipeline browser interaction only; never composes page templates. */
export function CrmPipelineFeatureClient({
  criteria, pageInfo, slot,
}: {
  criteria: CrmSearchState;
  pageInfo: CrmPageInfo;
  slot: "toolbar" | "pagination";
}) {
  const controls = useCrmSearch(criteria, "pipeline");
  return slot === "toolbar" ? (
    <CrmListFiltersBlock
      mode="pipeline"
      query={controls.query}
      sort={criteria.sort}
      filter={criteria.stage ?? ""}
      onQueryChange={controls.onQueryChange}
      onSortChange={controls.onSortChange}
      onFilterChange={controls.onFilterChange}
    />
  ) : (
    <CrmPaginationBlock
      pageInfo={pageInfo}
      pending={controls.pending}
      onPageChange={controls.onPageChange}
    />
  );
}
