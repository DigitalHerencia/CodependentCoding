import { getCrmAccounts } from "@/lib/fetchers/crmFetchers";
import { CrmAccountsFeatureClient } from "./crm-accounts-feature.client";
export async function CrmAccountsFeature() {
  return <CrmAccountsFeatureClient accounts={await getCrmAccounts()} />;
}
