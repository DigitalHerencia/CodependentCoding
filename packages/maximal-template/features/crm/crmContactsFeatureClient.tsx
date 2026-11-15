"use client";

import { CrmListFiltersBlock, CrmPaginationBlock } from "@/components/blocks/crm-blocks";
import type { CrmPageInfo } from "@/types/crmTypes";
import { useCrmSearch, type CrmSearchState } from "./crmSearchFeatureClient";

/** CRM_Contacts browser interaction only; never composes page templates. */
export function CrmContactsFeatureClient({
  criteria, pageInfo, slot,
}: {
  criteria: CrmSearchState;
  pageInfo: CrmPageInfo;
  slot: "toolbar" | "pagination";
}) {
  const controls = useCrmSearch(criteria, "contacts");
  return slot === "toolbar" ? (
    <CrmListFiltersBlock
      mode="contacts"
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
