import { loadCrmAccountsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmAccountsFeatureClient } from "./crm-accounts-feature.client";

export async function CrmAccountsFeature() {
  const { accounts } = await loadCrmAccountsWorkflow();
  return <CrmAccountsFeatureClient accounts={accounts} />;
}
