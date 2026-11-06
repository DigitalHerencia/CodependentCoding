"use client";

import { CrmPipelineTemplate } from "@/components/templates/crm-templates";
import { selectCrmPipelineWorkflow } from "@/lib/workflows/crmClientWorkflows";
import type { CrmDealSummaryDTO } from "@/types/crmTypes";
import { useState } from "react";
import { EditCrmDealStageForm } from "./editCrmDealStageForm";

export function CrmPipelineFeatureClient({
  deals,
}: {
  deals: CrmDealSummaryDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <CrmPipelineTemplate
      {...selectCrmPipelineWorkflow(deals, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
      renderControls={(deal) => (
        <EditCrmDealStageForm key={deal.id + "-" + deal.version} deal={deal} />
      )}
    />
  );
}
