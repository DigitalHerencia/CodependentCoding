import { CrmAccountsTemplate } from "@/components/templates/crm-templates";
import { loadCrmAccountsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmAccountsFeatureClient } from "./crmAccountsFeatureClient";

/** CRM Accounts directory server feature: one persisted workflow and one CRM template. */
export async function CrmAccountsFeature({ criteria }: { criteria: unknown }) {
  const view = await loadCrmAccountsWorkflow(criteria);
  return (
    <CrmAccountsTemplate
      accounts={view.accounts}
      toolbar={<CrmAccountsFeatureClient key={view.criteria.q + ":" + view.criteria.page + ":" + view.criteria.sort} criteria={view.criteria} pageInfo={view.pageInfo} slot="toolbar" />}
      pagination={<CrmAccountsFeatureClient key={view.criteria.q + ":" + view.criteria.page + ":" + view.criteria.sort} criteria={view.criteria} pageInfo={view.pageInfo} slot="pagination" />}
    />
  );
}
