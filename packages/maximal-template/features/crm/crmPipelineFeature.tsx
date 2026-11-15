import { CrmPipelineTemplate } from "@/components/templates/crm-templates";
import { loadCrmPipelineWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmPipelineFeatureClient } from "./crmPipelineFeatureClient";
import { CrmNewOpportunityForm } from "./crmNewOpportunityForm";
import { CrmEditDealStageForm } from "./crmEditDealStageForm";

/** CRM pipeline server feature: one persisted workflow and one CRM template. */
export async function CrmPipelineFeature({ criteria }: { criteria: unknown }) {
  const view = await loadCrmPipelineWorkflow(criteria);
  return (
    <CrmPipelineTemplate
      stages={view.stages}
      toolbar={<CrmPipelineFeatureClient key={view.criteria.q + ":" + view.criteria.page + ":" + view.criteria.sort} criteria={view.criteria} pageInfo={view.pageInfo} slot="toolbar" />}
      pagination={<CrmPipelineFeatureClient key={view.criteria.q + ":" + view.criteria.page + ":" + view.criteria.sort} criteria={view.criteria} pageInfo={view.pageInfo} slot="pagination" />}
      creationControl={<CrmNewOpportunityForm accounts={view.accounts} />}
      renderControls={(deal) => <CrmEditDealStageForm key={deal.id + "-" + deal.version} deal={deal} />}
    />
  );
}
