import { loadCrmPipelineWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmPipelineFeatureClient } from "./crm-pipeline-feature.client";
import { NewCrmOpportunityForm } from "./newCrmOpportunityForm";

export async function CrmPipelineFeature() {
  const { deals, accounts } = await loadCrmPipelineWorkflow();
  return (
    <>
      <NewCrmOpportunityForm accounts={accounts} />
      <CrmPipelineFeatureClient deals={deals} />
    </>
  );
}
