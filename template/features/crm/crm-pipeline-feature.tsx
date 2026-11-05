import { CrmOpportunityForm } from "./crm-opportunity-form.client";
import { getCrmAccounts } from "@/lib/fetchers/crmFetchers";
import { CrmPipelineFeatureClient } from "./crm-pipeline-feature.client";
import { getCrmWorkspaceWorkflow } from "@/lib/workflows/crmWorkflows";

export async function CrmPipelineFeature() {
  const { deals } = await getCrmWorkspaceWorkflow();
  return (
    <>
      <CrmOpportunityForm accounts={await getCrmAccounts()} />
      <CrmPipelineFeatureClient deals={deals} />
    </>
  );
}
