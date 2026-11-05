"use client";
import { useState } from "react";
import { CrmPipelineTemplate } from "@/components/templates/crm-templates";
import { CrmPipelineToolbar } from "@/components/blocks/crm-blocks";
import { CrmDealStageForm } from "./crm-deal-stage-form";
import type { CrmDealSummaryDTO } from "@/types/crmTypes";
export function CrmPipelineFeatureClient({
  deals,
}: {
  deals: CrmDealSummaryDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <CrmPipelineTemplate
      deals={deals.filter((deal) =>
        (
          deal.name +
          " " +
          deal.account.name +
          " " +
          (deal.owner?.displayName ?? "")
        )
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<CrmPipelineToolbar query={query} onQueryChange={setQuery} />}
      renderControls={(deal) => (
        <CrmDealStageForm key={deal.id + "-" + deal.version} deal={deal} />
      )}
    />
  );
}
