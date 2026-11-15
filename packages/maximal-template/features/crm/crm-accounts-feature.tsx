import { CrmAccountsTemplate } from "@/components/templates/crm-templates";
import { loadCrmAccountsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmAccountsFeatureClient } from "./crm-accounts-feature.client";

/** Server page feature: exactly one CRM read workflow and one CRM template. */
export async function CrmAccountsFeature({ query = "" }: { query?: string }) {
  const view = await loadCrmAccountsWorkflow(query);
  return (
    <CrmAccountsTemplate
      {...view}
      toolbar={<CrmAccountsFeatureClient key={query} initialQuery={query} />}
    />
  );
}
