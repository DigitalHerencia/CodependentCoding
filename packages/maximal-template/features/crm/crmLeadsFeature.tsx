import { CrmLeadsTemplate } from "@/components/templates/crm-templates";
import { loadCrmLeadsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmLeadsFeatureClient } from "./crmLeadsFeatureClient";

/** CRM Leads directory server feature: one persisted workflow and one CRM template. */
export async function CrmLeadsFeature({ criteria }: { criteria: unknown }) {
  const view = await loadCrmLeadsWorkflow(criteria);
  return (
    <CrmLeadsTemplate
      contacts={view.contacts}
      lead
      toolbar={<CrmLeadsFeatureClient key={view.criteria.q + ":" + view.criteria.page + ":" + view.criteria.sort} criteria={view.criteria} pageInfo={view.pageInfo} slot="toolbar" />}
      pagination={<CrmLeadsFeatureClient key={view.criteria.q + ":" + view.criteria.page + ":" + view.criteria.sort} criteria={view.criteria} pageInfo={view.pageInfo} slot="pagination" />}
    />
  );
}
