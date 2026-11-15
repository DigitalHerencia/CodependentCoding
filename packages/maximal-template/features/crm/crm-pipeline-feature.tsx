import { CrmPipelineTemplate } from "@/components/templates/crm-templates";
import { loadCrmPipelineWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmPipelineFeatureClient } from "./crm-pipeline-feature.client";
import { NewCrmOpportunityForm } from "./newCrmOpportunityForm";
import { EditCrmDealStageForm } from "./editCrmDealStageForm";

/** Server pipeline feature: one workflow and one template with form/interaction slots. */
export async function CrmPipelineFeature({ query = "" }: { query?: string }) {
  const view = await loadCrmPipelineWorkflow(query);
  return (
    <CrmPipelineTemplate
      stages={view.stages}
      creationControl={<NewCrmOpportunityForm accounts={view.accounts} />}
      toolbar={<CrmPipelineFeatureClient key={query} initialQuery={query} />}
      renderControls={(deal) => (
        <EditCrmDealStageForm key={deal.id + "-" + deal.version} deal={deal} />
      )}
    />
  );
}
