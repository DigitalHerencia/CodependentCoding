import { loadCrmContactsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmContactsFeatureClient } from "./crm-contacts-feature.client";

export async function CrmContactsFeature() {
  const { contacts } = await loadCrmContactsWorkflow();
  return <CrmContactsFeatureClient contacts={contacts} />;
}
