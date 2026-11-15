"use client";

import { CrmListFiltersBlock, CrmPaginationBlock } from "@/components/blocks/crm-blocks";
import type { CrmPageInfo } from "@/types/crmTypes";
import { useCrmSearch, type CrmSearchState } from "./crmSearchFeatureClient";

/** CRM_Leads browser interaction only; never composes page templates. */
export function CrmLeadsFeatureClient({
  criteria, pageInfo, slot,
}: {
  criteria: CrmSearchState;
  pageInfo: CrmPageInfo;
  slot: "toolbar" | "pagination";
}) {
  const controls = useCrmSearch(criteria, "leads");
  return slot === "toolbar" ? (
    <CrmListFiltersBlock
      mode="leads"
      query={controls.query}
      sort={criteria.sort}
      filter={criteria.status ?? ""}
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
