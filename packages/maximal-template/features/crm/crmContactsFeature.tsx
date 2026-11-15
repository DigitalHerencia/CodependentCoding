import { CrmContactsTemplate } from "@/components/templates/crm-templates";
import { loadCrmContactsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmContactsFeatureClient } from "./crmContactsFeatureClient";

/** CRM Contacts directory server feature: one persisted workflow and one CRM template. */
export async function CrmContactsFeature({ criteria }: { criteria: unknown }) {
  const view = await loadCrmContactsWorkflow(criteria);
  return (
    <CrmContactsTemplate
      contacts={view.contacts}
      toolbar={<CrmContactsFeatureClient key={view.criteria.q + ":" + view.criteria.page + ":" + view.criteria.sort} criteria={view.criteria} pageInfo={view.pageInfo} slot="toolbar" />}
      pagination={<CrmContactsFeatureClient key={view.criteria.q + ":" + view.criteria.page + ":" + view.criteria.sort} criteria={view.criteria} pageInfo={view.pageInfo} slot="pagination" />}
    />
  );
}
